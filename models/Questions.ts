import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Organization from './Organizations';
import QuestionChoice from './QuestionChoices';

const Question = sequelize.define('Question', {
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Organization,
            key: 'id'
        }
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'Questions'
});

export default Question;