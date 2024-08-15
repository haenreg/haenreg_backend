import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Case from './Cases';
import Question from './Questions';

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
    }
}, {
    tableName: 'Answers'
});

// Define relationships with aliases
Answer.belongsTo(Case, { foreignKey: 'caseId', as: 'case' });
Case.hasMany(Answer, { foreignKey: 'caseId', as: 'answers' }); // Alias as 'answers'

Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });
Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answers' }); // Alias as 'answers'

export default Answer;
