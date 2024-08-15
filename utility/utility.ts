import { IncludeOptions } from 'sequelize';
import Answer from '../models/Answers';
import Question from '../models/Questions';
import AnswerChoice from '../models/AnswerChoices';
import QuestionChoice from '../models/QuestionChoices';

export function getCaseQueryConfig(): { attributes: string[], include: IncludeOptions[] } {
    return {
        attributes: ['id', 'approved'],
        include: [
            {
                model: Answer,
                attributes: ['id', 'answer'],
                include: [
                    {
                        model: Question,
                        attributes: ['id', 'title', 'description', 'type'],
                    },
                    {
                        model: AnswerChoice,
                        attributes: ['id'],
                        include: [
                            {
                                model: QuestionChoice,
                                attributes: ['id', 'choice'],
                                include: [
                                    {
                                        model: QuestionChoice,
                                        as: 'Dependent',
                                        attributes: ['id', 'choice'],
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
}
