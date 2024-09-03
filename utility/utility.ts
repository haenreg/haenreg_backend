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
                                attributes: ['id', 'choice', 'dependantChoice'],
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

export function transformDependentChoicesCase(caseData: any) {
    const transformedCase = caseData.toJSON();

    transformedCase.answers.forEach(answer => {
        answer.answerChoices.forEach(answerChoice => {
            const questionChoice = answerChoice.questionChoice;

            if (questionChoice.dependent) {
                // Swap the dependent and primary questionChoice
                answerChoice.questionChoice = {
                    id: questionChoice.dependent.id,
                    choice: questionChoice.dependent.choice,
                    dependent: [{
                        id: questionChoice.id,
                        choice: questionChoice.choice
                    }]
                };
            }
            delete answerChoice.questionChoice.dependantChoice;
        });
    });

    return transformedCase;
}

export function transformDependentChoicesCases(casesData: any[]): any[] {
    return casesData.map(caseData => {
        return transformDependentChoicesCase(caseData);
    });
}
