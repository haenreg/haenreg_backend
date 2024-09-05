import express, { Router, Request, Response } from 'express';
import { iUser } from "../interfaces/iUser";
import { authenticateToken, verifyIsLeader } from "../validation/auth";
import Question from '../models/Questions';
import QuestionChoice from '../models/QuestionChoices';
import sequelize from '../config/database';
import { createQuestionValidation } from '../validation/validation';
import { QuestionType } from '../interfaces/iQuestion';

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

router.post('/create-question', verifyIsLeader, async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();

    try {
        const { error } = createQuestionValidation(req.body);

        if (error) {
            await transaction.rollback();
            return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
        }

        const organizationId = req.user?.organizationId

        const { title, description, type, questionChoices } = req.body;

        const question = await Question.create(
            {
                title,
                description,
                type,
                organizationId
            },
            { transaction }
        );

        const questionId = question.get('id');

        if (questionChoices && questionChoices.length > 0 && (type == QuestionType.MultiSelect || type == QuestionType.SelectOne)) {
            for (const choiceData of questionChoices) {
                const { choice, dependent } = choiceData;

                const mainChoice = await QuestionChoice.create(
                    {
                        questionId: questionId,
                        choice,
                    },
                    { transaction }
                );

                const mainChoiceId = mainChoice.get('id');

                if (dependent && dependent.choice) {
                    await QuestionChoice.create(
                        {
                            questionId: questionId,
                            choice: dependent.choice,
                            dependantChoice: mainChoiceId,
                        },
                        { transaction }
                    );
                }
            }
        }

        await transaction.commit();

        res.status(201).json({ message: 'Question created successfully', question });

    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: (error as Error).message });
    }
});

router.post('/update-question/:questionId', verifyIsLeader, async (req: Request, res: Response) => {
    const transaction = await sequelize.transaction();

    try {
        const { questionId } = req.params;
        const { title, description, type, questionChoices } = req.body;

        const question = await Question.findOne({ where: { id: questionId, organizationId: req.user?.organizationId } });

        if (!question) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Question not found' });
        }

        await question.update({ title, description, type }, { transaction });

        if (questionChoices && (type == QuestionType.MultiSelect || type == QuestionType.SelectOne)) {

            await QuestionChoice.destroy({ where: { questionId }, transaction });

            for (const choiceData of questionChoices) {
                const { choice, dependent } = choiceData;

                const mainChoice = await QuestionChoice.create(
                    {
                        questionId: questionId,
                        choice,
                    },
                    { transaction }
                );

                const mainChoiceId = mainChoice.get('id');

                if (dependent && dependent.choice) {
                    await QuestionChoice.create(
                        {
                            questionId: questionId,
                            choice: dependent.choice,
                            dependantChoice: mainChoiceId,
                        },
                        { transaction }
                    );
                }
            }
        }

        await transaction.commit();

        res.status(200).json({ message: 'Question updated successfully', question });

    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;