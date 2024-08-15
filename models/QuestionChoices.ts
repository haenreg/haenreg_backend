import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
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

// Define relationships
QuestionChoice.belongsTo(Question, { foreignKey: 'questionId' });
Question.hasMany(QuestionChoice, { foreignKey: 'questionId' });

QuestionChoice.belongsTo(QuestionChoice, { as: 'Dependent', foreignKey: 'dependantChoice' });

export default QuestionChoice;
