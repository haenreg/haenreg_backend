import express, { Router, Request, Response } from 'express';
import { authenticateToken } from '../validation/auth';
import { createCaseValidation } from '../validation/validation';
import sequelize from '../config/database';
import { iUser } from '../interfaces/iUser';
import Case from '../models/Cases';
import Answer from '../models/Answers';
import AnswerChoice from '../models/AnswerChoices';
import { CaseApproved } from '../interfaces/iCase';

const router = Router();

declare module 'express-serve-static-core' {
  interface Request {
    user?: iUser; // Now TypeScript knows that req.user is of type iUser
  }
}

router.get('/create-new-case', authenticateToken,  async (req: Request, res: Response) => {
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
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;