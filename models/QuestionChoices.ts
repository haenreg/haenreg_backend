import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Organization from './Organizations';
import Question from './Questions';

const QuestionChoice = sequelize.define('QuestionChoice', {
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Organization,
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
    choice: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'QuestionChoices'
});

export default QuestionChoice;