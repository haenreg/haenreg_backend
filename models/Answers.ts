import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Question from './Questions';
import QuestionChoice from './QuestionChoices';
import Case from './Cases';

const Answer = sequelize.define('Answer', {
    caseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Case,
            key: 'id'
        }
    },
    questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Question,
            key: 'id'
        }
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    choiceId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: QuestionChoice,
            key: 'id'
        }
    }
}, {
    tableName: 'Answers'
});

export default Answer;