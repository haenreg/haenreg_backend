import express, { Router, Request, Response } from 'express';
import { authenticateToken } from '../validation/auth';
import { createCaseValidation } from '../validation/validation';
import sequelize from '../config/database';
import { iUser } from '../interfaces/iUser';
import Case from '../models/Cases';
import Answer from '../models/Answers';
import AnswerChoice from '../models/AnswerChoices';
import { CaseApproved } from '../interfaces/iCase';
import Question from '../models/Questions';
import QuestionChoice from '../models/QuestionChoices';
import { getCaseQueryConfig } from '../utility/utility';

const router = Router();

declare module 'express-serve-static-core' {
  interface Request {
    user?: iUser;
  }
}

router.post('/create-new-case', authenticateToken,  async (req: Request, res: Response) => {
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
      // If there's a choice, create an AnswerChoice
      if (answer.choice) {
        await AnswerChoice.create(
          {
            answerId: answerId,
            choiceId: answer.choice,
          },
          { transaction }
        );
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

router.get('/get-cases-by-user', authenticateToken, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; // Get user ID from the authenticated user

        // Fetch cases for the given user, including associated answers, questions, and choices
        const caseQueryConfig = getCaseQueryConfig();
        const cases = await Case.findAll({
            where: { userId },
            ...caseQueryConfig
        });


        res.status(200).json(cases);
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

        res.status(200).json(_case);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
})

export default router;