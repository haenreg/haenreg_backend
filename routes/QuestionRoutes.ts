import express, { Router, Request, Response } from 'express';
import { iUser } from "../interfaces/iUser";
import { authenticateToken } from "../validation/auth";
import Question from '../models/Questions';
import QuestionChoice from '../models/QuestionChoices';

const router = Router();

declare module 'express-serve-static-core' {
  interface Request {
    user?: iUser;
  }
}

router.get('/get-questions', authenticateToken, async (req: Request, res: Response) => {
    try {
        const organizationId = req.user?.organizationId;

        const questions = await Question.findAll({
            where: {
                organizationId
            },
            attributes: ['id', 'title', 'description', 'type'],
            include: [
                {
                    model: QuestionChoice,
                    as: 'questionChoices',
                    attributes: ['id', 'choice'],
                    include: [
                        {
                            model: QuestionChoice,
                            as: 'dependent',
                            attributes: ['id', 'choice'],
                        }
                    ]
                }
            ]
        });

        const processedQuestions = questions.map((question: any) => {
            const choiceMap: { [key: number]: any } = {};
            const processedChoices: any[] = [];

            // First, map all choices by their ID
            question.questionChoices.forEach((choice: any) => {
                choiceMap[choice.id] = {
                    id: choice.id,
                    choice: choice.choice,
                    dependent: []
                };
            });

            // Then, populate the Dependent array for each choice
            question.questionChoices.forEach((choice: any) => {
                if (choice.dependent) {
                    choiceMap[choice.dependent.id].dependent.push({
                        id: choice.id,
                        choice: choice.choice
                    });
                } else {
                    processedChoices.push(choiceMap[choice.id]);
                }
            });

            return {
                id: question.id,
                title: question.title,
                description: question.description,
                type: question.type,
                questionChoices: processedChoices
            };
        });

        return res.status(200).json(processedQuestions);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


export default router;