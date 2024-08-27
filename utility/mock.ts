import bcrypt from 'bcrypt';
import User from '../models/Users';
import Organization from '../models/Organizations';
import Question from '../models/Questions';
import QuestionChoice from '../models/QuestionChoices';
import Case from '../models/Cases';
import Answer from '../models/Answers';
import { iQuestion, QuestionType } from '../interfaces/iQuestion';
import { iUser } from '../interfaces/iUser';
import { iOrganization } from '../interfaces/iOrganization';
import { iQuestionChoice } from '../interfaces/iQuestionChoice';
import { iAnswer } from '../interfaces/iAnswer';
import { iAnswerChoice } from '../interfaces/iAnswerChoices';
import { iCase, CaseApproved } from '../interfaces/iCase';
import AnswerChoice from '../models/AnswerChoices';

const mockUsers: iUser[] = [
    {
        username: 'peter',
        password: 'password123',
        organizationId: 1
    },
    {
        username: 'yvonne',
        password: 'password321',
        organizationId: 2
    },
    {
        username: 'lone',
        password: '321drowssap',
        organizationId: 1
    },
    {
        username: 'bente',
        password: 'password123',
        organizationId: 1,
        isOrgLeader: true
    },
    {
        username: 'kurt',
        password: 'password123',
        organizationId: 2,
        isOrgLeader: true
    },
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
    },
    {
        organizationId: 1,
        title: 'Situation',
        description: 'I hvilken situation skete episoden',
        type: QuestionType.SelectOne
    },
    {
        organizationId: 1,
        title: 'Påvirkning',
        description: 'Hvor meget påvirkede det dig bagefter?',
        type: QuestionType.Scale
    },
    {
        organizationId: 1,
        title: 'Mulighed for hjælp',
        description: 'Var der mulighed for at tilkalde hjælp?',
        type: QuestionType.YesNo
    }
];

const mockQuestionChoices: iQuestionChoice[] = [
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
    },
    {
        questionId: 6,
        choice: 'Afslag på ønske/krav'
    },
    {
        questionId: 6,
        choice: 'Forsøg på at berolige ophidset person'
    },
    {
        questionId: 6,
        choice: 'Konfliktløsning mellem person og ansat'
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
        questionId: 4
    },
    {
        caseId: 4,
        questionId: 4
    },
    {
        caseId: 6,
        questionId: 4
    },
    {
        caseId: 1,
        questionId: 5
    },
    {
        caseId: 2,
        questionId: 5
    },
    {
        caseId: 3,
        questionId: 5
    },
    {
        caseId: 4,
        questionId: 5
    },
    {
        caseId: 5,
        questionId: 5
    },
    {
        caseId: 6,
        questionId: 5
    },
    {
        caseId: 7,
        questionId: 5
    },
    {
        caseId: 1,
        questionId: 6
    },
    {
        caseId: 3,
        questionId: 6
    },
    {
        caseId: 4,
        questionId: 6
    },
    {
        caseId: 5,
        questionId: 6
    },
    {
        caseId: 6,
        questionId: 6
    },
    // Choice answers (QuestionType.Scale)
    {
        caseId: 1,
        questionId: 7,
        answer: '5'
    },
    {
        caseId: 3,
        questionId: 7,
        answer: '6'
    },
    {
        caseId: 4,
        questionId: 7,
        answer: '10'
    },
    {
        caseId: 5,
        questionId: 7,
        answer: '1'
    },
    {
        caseId: 6,
        questionId: 7,
        answer: '2'
    },
    // Choice answers (QuestionType.YesNo)
    {
        caseId: 1,
        questionId: 8,
        answer: 'YES'
    },
    {
        caseId: 3,
        questionId: 8,
        answer: 'YES'
    },
    {
        caseId: 4,
        questionId: 8,
        answer: 'NO'
    },
    {
        caseId: 5,
        questionId: 8,
        answer: 'NO'
    },
    {
        caseId: 6,
        questionId: 8,
        answer: 'YES'
    },
];

const mockAnswerChoices: iAnswerChoice[] = [
    {
        answerId: 12,
        choiceId: 1 // Skolegården
    },
    {
        answerId: 13,
        choiceId: 3 // SFO'en
    },
    {
        answerId: 14,
        choiceId: 2 // Klasseværelset
    },
    {
        answerId: 15,
        choiceId: 5 // Spark
    },
    {
        answerId: 16,
        choiceId: 4 // Spyt
    },
    {
        answerId: 17,
        choiceId: 6 // Niven
    },
    {
        answerId: 18,
        choiceId: 7 // Kradsen
    },
    {
        answerId: 19,
        choiceId: 8 // På arm
    },
    {
        answerId: 20,
        choiceId: 9 // I hovedet
    },
    {
        answerId: 21,
        choiceId: 4 // Spyt
    },
    // chocies 10,11,12
    {
        answerId: 22,
        choiceId: 10 // Afslag på ønske/krav
    },
    {
        answerId: 23,
        choiceId: 11 // Forsøg på at berolige ophidset person
    },
    {
        answerId: 24,
        choiceId: 12 // Konfliktløsning mellem person og ansat
    },
    {
        answerId: 25,
        choiceId: 10 // Afslag på ønske/krav
    },
    {
        answerId: 26,
        choiceId: 12 // Konfliktløsning mellem person og ansat
    },
]

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

    const answerChoiceCount = await AnswerChoice.count();
    if (answerChoiceCount === 0) {
        await createMockAnswerChoices();
        console.log('Created mocked answer choices!');
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
                organizationId: user.organizationId,
                isOrgLeader: user.isOrgLeader
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
                answer: answer.answer
            })
    } catch (error) {
        console.error('Error creating answers');
    }
    }
};

const createMockAnswerChoices = async () => {
    for (const answerChoice of mockAnswerChoices) {
        try {
            await AnswerChoice.create({
                answerId: answerChoice.answerId,
                choiceId: answerChoice.choiceId
            })
    } catch (error) {
        console.error('Error creating answer choices');
    }
    }
};
