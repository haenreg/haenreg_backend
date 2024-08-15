import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Answer from './Answers';
import QuestionChoice from './QuestionChoices';

const AnswerChoice = sequelize.define('AnswerChoices', {
    answerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Answer,
            key: 'id'
        }
    },
    choiceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: QuestionChoice,
            key: 'id'
        }
    }
}, {
    tableName: 'AnswerChoices',
    indexes: [
        {
            fields: ['answerId', 'choiceId'],
            unique: true // Ensures that a particular answer can only have one specific choice
        }
    ]
});

// Define relationships
AnswerChoice.belongsTo(Answer, { foreignKey: 'answerId' });
Answer.hasMany(AnswerChoice, { foreignKey: 'answerId' });

AnswerChoice.belongsTo(QuestionChoice, { foreignKey: 'choiceId' });
QuestionChoice.hasMany(AnswerChoice, { foreignKey: 'choiceId' });

export default AnswerChoice;
