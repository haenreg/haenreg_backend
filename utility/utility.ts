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
                as: 'answers',
                attributes: ['id', 'answer'],
                include: [
                    {
                        model: Question,
                        as: 'question',
                        attributes: ['id', 'title', 'description', 'type'],
                    },
                    {
                        model: AnswerChoice,
                        as: 'answerChoices',
                        attributes: ['id'],
                        include: [
                            {
                                model: QuestionChoice,
                                as: 'questionChoice',
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
                    }
                ]
            }
        ]
    };
}
