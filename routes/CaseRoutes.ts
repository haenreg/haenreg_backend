import express, { Router, Request, Response } from 'express';
import { authenticateToken, verifyIsLeader } from '../validation/auth';
import { createCaseValidation } from '../validation/validation';
import sequelize from '../config/database';
import { iUser } from '../interfaces/iUser';
import Case from '../models/Cases';
import Answer from '../models/Answers';
import AnswerChoice from '../models/AnswerChoices';
import { CaseApproved } from '../interfaces/iCase';
import Question from '../models/Questions';
import QuestionChoice from '../models/QuestionChoices';
import { getCaseQueryConfig, sortCases, transformDependentChoicesCase, transformDependentChoicesCases } from '../utility/utility';

const router = Router();

declare module 'express-serve-static-core' {
  interface Request {
    user?: iUser;
  }
}

router.post('/create-new-case', authenticateToken, async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const { error } = createCaseValidation(req.body);

    if (error) {
      await transaction.rollback();
      return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
    }

    if (!req.user) {
      return res.status(400).json({ message: 'No user found' });
    }

    const userId = req.user.id;
    const organizationId = req.user.organizationId;

    // Step 1: Create the case
    const newCase = await Case.create(
      { userId, organizationId, approved: CaseApproved.Waiting },
      { transaction }
    );

    const caseId = newCase.get('id') as number;

    // Step 2: Loop through the questions and create answers
    for (const caseItem of req.body) {
      const { question, answer } = caseItem;

      // Create the Answer
      const newAnswer = await Answer.create(
        {
          caseId: caseId,
          questionId: question,
          answer: answer.answer || null, // Only set if there's an answer text
        },
        { transaction }
      );

      const answerId = newAnswer.get('id') as number;

      // If there's a choice array, create AnswerChoice entries
      if (Array.isArray(answer.choice)) {
        for (const choiceId of answer.choice) {
          await AnswerChoice.create(
            {
              answerId: answerId,
              choiceId: choiceId,
            },
            { transaction }
          );
        }
      }
    }

    // Step 3: Commit the transaction
    await transaction.commit();

    res.status(200).json({ message: 'Case created successfully', caseId: caseId });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/update-case/:caseId', authenticateToken, async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.user?.id;
    const { caseId } = req.params;

    const { error } = createCaseValidation(req.body);

    if (error) {
      await transaction.rollback();
      return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
    }

    let caseToEdit = await Case.findOne({
      where: { id: caseId, userId: userId }
    });

    if (!caseToEdit) {
      await transaction.rollback();
      return res.status(400).json({ message: 'No case found' });
    }

    const changedAnswers = req.body;

    for (const caseItem of changedAnswers) {
      const { question, answer } = caseItem;

      await Answer.update(
        { answer: answer.answer || null },
        {
          where: {
            caseId: caseId,
            questionId: question
          },
          transaction
        }
      );

      if (Array.isArray(answer.choice)) {
        
        const answerInstance = await Answer.findOne({
          where: { caseId: caseId, questionId: question },
          transaction
        }) as unknown as typeof Answer & { id: number };

        if (answerInstance) {
          // First, delete any existing choices for this answer
          await AnswerChoice.destroy({
            where: {
              answerId: answerInstance.id,
            },
            transaction,
          });

          // Then, insert the new choices
          for (const choiceId of answer.choice) {
            await AnswerChoice.create(
              {
                answerId: answerInstance.id,
                choiceId: choiceId,
              },
              { transaction }
            );
          }
        }
      }
    }

    await transaction.commit();
    return res.status(200).json({ message: 'Case updated successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/get-cases-by-user', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; // Get user ID from the authenticated user

        // Fetch cases for the given user, including associated answers, questions, and choices
        const caseQueryConfig = getCaseQueryConfig();
        const cases = await Case.findAll({
            where: { userId },
            ...caseQueryConfig
        });

        const transformedCases = transformDependentChoicesCases(cases);


        res.status(200).json(transformedCases);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.get('/get-case/:caseId', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const isUserLeader = req.user?.isOrgLeader;

        const { caseId } = req.params;

        const caseQueryConfig = getCaseQueryConfig();

        let _case;

        if (!isUserLeader) {
            _case = await Case.findOne({
                where: { id: caseId, userId: userId},
                ...caseQueryConfig
            });
        } else {
            _case = await Case.findOne({
                where: { id: caseId},
                ...caseQueryConfig
            });
        }

        if (!_case) {
            return res.status(400).json({ message: 'No case found' });
        }

        // Transform the data structure as needed
        const transformedCase = transformDependentChoicesCase(_case);

        res.status(200).json(transformedCase);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.post('/get-all-cases', verifyIsLeader, async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, userId, sortField, sortOrder = 'ASC', status } = req.body;

        const orgId = req.user?.organizationId

        const offset = (page - 1) * limit;
        const caseQueryConfig = getCaseQueryConfig();

        // Build the where clause for filtering
        const whereClause: any = {
          organizationId: orgId
        };

        if (userId) {
            whereClause.userId = userId;
        }

        if (status) {
            whereClause.approved = status;
        }

        let orderBy: any[] = [['id', 'DESC']];

        if (sortField) {
            const questionId = parseInt(sortField, 10);
            orderBy = [];
        }

        // Fetch cases with pagination and filtering
        const cases = await Case.findAndCountAll({
            where: whereClause,
            ...caseQueryConfig,
            order: orderBy,
            limit,
            offset,
            distinct: true, // Ensures proper count when using include
        });

        let transformedCases = transformDependentChoicesCases(cases.rows);

        // Apply sorting by questionId
        if (sortField) {
            const questionId = parseInt(sortField, 10);
            transformedCases = sortCases(transformedCases, questionId, sortOrder);
        }

        res.status(200).json({
            totalItems: cases.count,
            totalPages: Math.ceil(cases.count / limit),
            currentPage: page,
            data: transformedCases
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.get('/approve-case/:caseId', verifyIsLeader, async (req: Request, res: Response) => {
  try {
    const { caseId } = req.params;

    const orgId = req.user?.organizationId

    const _case = await Case.findOne({
      where: { id: caseId, organizationId: orgId}
    }) as any;

    if (!_case) {
      return res.status(404).json({ message: 'Case not found' });
    }

    _case.approved = CaseApproved.Approved;

    await _case.save();

    res.status(200).json({ message: 'Case approved successfully', case: _case });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get('/disprove-case/:caseId', verifyIsLeader, async (req: Request, res: Response) => {
  try {
    const { caseId } = req.params;

    const orgId = req.user?.organizationId

    const _case = await Case.findOne({
      where: { id: caseId, organizationId: orgId}
    }) as any;

    if (!_case) {
      return res.status(404).json({ message: 'Case not found' });
    }

    _case.approved = CaseApproved.NotApproved;

    await _case.save();

    res.status(200).json({ message: 'Case disproved successfully', case: _case });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;