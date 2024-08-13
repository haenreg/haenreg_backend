import bcrypt from 'bcrypt';
import User from './models/Users';
import Organization from './models/Organizations';
import Question from './models/Questions';
import QuestionChoice from './models/QuestionChoices';
import Case from './models/Cases';
import Answer from './models/Answers';
import { iQuestion, QuestionType } from './interfaces/iQuestion';
import { iUser } from './interfaces/iUser';
import { iOrganization } from './interfaces/iOrganization';
import { iQuestionChoice } from './interfaces/iQuestionChoice';
import { iAnswer } from './interfaces/iAnswer';
import { iCase, CaseApproved } from './interfaces/iCase';

const mockUsers: iUser[] = [
    {
        username: 'peter',
        password: 'password123',
        organizationId: 1
    },
    {
        username: 'anders',
        password: 'password321',
        organizationId: 2
    },
    {
        username: 'lotte',
        password: '321drowssap',
        organizationId: 1
    }
];

const mockOrganizations: iOrganization[] = [
    {
        name: 'Østerbyskolen',
    },
    {
        name: 'Grønvangskolen'
    }
];

const mockQuestions: iQuestion[] = [
    {
        organizationId: 1,
        title: 'Dato',
        description: 'Dato på hændelsen',
        type: QuestionType.Date
    },
    {
        organizationId: 2,
        title: 'Dato',
        type: QuestionType.Date
    },
    {
        organizationId: 1,
        title: 'Lokation',
        description: 'Hvor skete hændelsen',
        type: QuestionType.Text
    },
    {
        organizationId: 2,
        title: 'Lokation',
        description: 'Hvor skete hændelsen',
        type: QuestionType.SelectOne
    },
    {
        organizationId: 1,
        title: 'Type',
        description: 'Hvilken slags hændelse var det',
        type: QuestionType.MultiSelect
    }
];

const mockQuestionChoices: iQuestionChoice[] = [
    {
        questionId: 3,
        choice: 'Foldboldbanen'
    },
    {
        questionId: 3,
        choice: 'Gangen'
    },
    {
        questionId: 3,
        choice: 'Klasseværelset'
    },
    {
        questionId: 4,
        choice: 'Skolegården'
    },
    {
        questionId: 4,
        choice: 'Klasseværelset'
    },
    {
        questionId: 4,
        choice: 'SFO\'en'
    },
    {
        questionId: 5,
        choice: 'Spyt'
    },
    {
        questionId: 5,
        choice: 'Spark'
    },
    {
        questionId: 5,
        choice: 'Niven'
    },
    {
        questionId: 5,
        choice: 'Kradsen'
    },
    {
        questionId: 5,
        choice: 'På arm',
        dependantChoice: 7
    },
    {
        questionId: 5,
        choice: 'I hovedet',
        dependantChoice: 7
    }
]

const mockCases: iCase[] = [
    {
        userId: 1,
        organizationId: 1,
        approved: CaseApproved.Approved
    },
    {
        userId: 2,
        organizationId: 2,
        approved: CaseApproved.Approved
    },
    {
        userId: 3,
        organizationId: 1,
        approved: CaseApproved.Approved
    },
    {
        userId: 1,
        organizationId: 1,
        approved: CaseApproved.NotApproved
    },
    {
        userId: 1,
        organizationId: 1,
        approved: CaseApproved.Approved
    },
    {
        userId: 1,
        organizationId: 1,
        approved: CaseApproved.Waiting
    },
    {
        userId: 2,
        organizationId: 2,
        approved: CaseApproved.Approved
    },
]

const mockAnswers: iAnswer[] = [
    // Date answers (QuestionType.Date)
    {
        caseId: 1,
        questionId: 1,
        answer: '01-01-2024'
    },
    {
        caseId: 2,
        questionId: 2,
        answer: '01-01-2024'
    },
    {
        caseId: 3,
        questionId: 1,
        answer: '13-04-2024'
    },
    {
        caseId: 4,
        questionId: 1,
        answer: '15-03-2024'
    },
    {
        caseId: 5,
        questionId: 1,
        answer: '29-05-2024'
    },
    {
        caseId: 6,
        questionId: 1,
        answer: '22-03-2024'
    },
    {
        caseId: 7,
        questionId: 2,
        answer: '04-04-2024'
    },
    // Text answers (QuestionType.Text)
    {
        caseId: 1,
        questionId: 3,
        answer: 'Foldboldbanen'
    },
    {
        caseId: 3,
        questionId: 3,
        answer: 'Klasseværelset'
    },
    {
        caseId: 5,
        questionId: 3,
        answer: 'Gangen'
    },
    {
        caseId: 7,
        questionId: 3,
        answer: 'Gangen'
    },
    // Choice answers (QuestionType.SelectOne or MultiSelect)
    {
        caseId: 2,
        questionId: 4,
        choiceId: 4 // Skolegården
    },
    {
        caseId: 4,
        questionId: 4,
        choiceId: 6 // SFO'en
    },
    {
        caseId: 6,
        questionId: 4,
        choiceId: 5 // Klasseværelset
    },
    {
        caseId: 1,
        questionId: 5,
        choiceId: 8 // Spark
    },
    {
        caseId: 2,
        questionId: 5,
        choiceId: 7 // Spyt
    },
    {
        caseId: 3,
        questionId: 5,
        choiceId: 9 // Niven
    },
    {
        caseId: 4,
        questionId: 5,
        choiceId: 10 // Kradsen
    },
    {
        caseId: 5,
        questionId: 5,
        choiceId: 11 // På arm
    },
    {
        caseId: 6,
        questionId: 5,
        choiceId: 12 // I hovedet
    },
    {
        caseId: 7,
        questionId: 5,
        choiceId: 7 // Spyt
    }
];

export async function generateMockData(): Promise<void> {
    const orgCount = await Organization.count();
    if (orgCount === 0) {
        await createMockOrgs();
        console.log('Created mocked organizations!');
    }

    const userCount = await User.count();
    if (userCount === 0) {
        await createMockUsers();
        console.log('Created mocked users!');
    }

    const questionCount = await Question.count();
    if (questionCount === 0) {
        await createMockQuestions();
        console.log('Created mocked questions!');
    }

    const questionChoiceCount = await QuestionChoice.count();
    if (questionChoiceCount === 0) {
        await createMockQuestionChoices();
        console.log('Created mocked question choices!');
    }

    const caseCount = await Case.count();
    if (caseCount === 0) {
        await createMockCases();
        console.log('Created mocked cases!');
    }

    const answerCount = await Answer.count();
    if (answerCount === 0) {
        await createMockAnswers();
        console.log('Created mocked answers!');
    }
}

const createMockUsers = async () => {
    for (const user of mockUsers) {
        if (!user.password) {
            continue;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        try {
            await User.create({
                username: user.username,
                password: hashedPassword,
                organizationId: user.organizationId
            });
        } catch (error) {
            console.error(`Error creating user ${user.username}:`, error);
        }
    }
};

const createMockOrgs = async () => {
    for (const organization of mockOrganizations) {
        try {
        await Organization.create({
            name: organization.name
        });
    } catch (error) {
        console.error(`Error creating organizations ${organization}`, error);
    }
    }
};

const createMockQuestions = async () => {
    for (const question of mockQuestions) {
        try {
            await Question.create({
                organizationId: question.organizationId,
                title: question.title,
                description: question.description,
                type: question.type
            })
        } catch (error) {
            console.error('Error creating questions');
        }
    }
};

const createMockQuestionChoices = async () => {
    for (const questionChoice of mockQuestionChoices) {
        try {
            await QuestionChoice.create({
                questionId: questionChoice.questionId,
                choice: questionChoice.choice,
                dependantChoice: questionChoice.dependantChoice
            });
        } catch (error) {
            console.error('Error creating question choices');
        }
    }
};

const createMockCases = async () => {
    for (const _case of mockCases) {
        try {
            await Case.create({
                userId: _case.userId,
                organizationId: _case.organizationId,
                approved: _case.approved
            });
        } catch (error) {
            console.error('Error creating cases');
        }
    }
};

const createMockAnswers = async () => {
    for (const answer of mockAnswers) {
        try {
            await Answer.create({
                caseId: answer.caseId,
                questionId: answer.questionId,
                answer: answer.answer,
                choiceId: answer.choiceId
            })
    } catch (error) {
        console.error('Error creating answers');
    }
    }
};
