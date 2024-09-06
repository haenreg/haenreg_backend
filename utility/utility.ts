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

export function sortCases(cases: any[], questionId: number, sortOrder: 'ASC' | 'DESC'): any[] {
    return cases.sort((a, b) => {
        let fieldA = getSortValue(a, questionId);
        let fieldB = getSortValue(b, questionId);

        if (sortOrder === 'ASC') {
            return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
        } else {
            return fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0;
        }
    });
}

export function getSortValue(caseData: any, questionId: number): string {
    const answer = caseData.answers.find(ans => ans.question.id === questionId);
    if (answer) {
        if (answer.question.type === 'TEXT' || answer.question.type === 'DATE') {
            return answer.answer || ''; // Sort by the answer string for TEXT or DATE types
        }
        if (answer.question.type === 'SELECT_ONE' || answer.question.type === 'MULTI_SELECT') {
            return answer.answerChoices.map(choice => choice.questionChoice.choice).join(', ') || ''; // Sort by the choices string
        }
    }
    return ''; // Default if no matching question found
}


