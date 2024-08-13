import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Organization from './Organizations';
import Question from './Questions';

const QuestionChoice = sequelize.define('QuestionChoice', {
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
    },
    dependantChoice: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'QuestionChoices',
            key: 'id'
        }
    }
}, {
    tableName: 'QuestionChoices'
});

QuestionChoice.belongsTo(QuestionChoice, { as: 'Dependent', foreignKey: 'dependantChoice' });

export default QuestionChoice;