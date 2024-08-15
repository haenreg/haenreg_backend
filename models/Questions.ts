import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Organization from './Organizations';

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

// Define relationships
Question.belongsTo(Organization, { foreignKey: 'organizationId' });
Organization.hasMany(Question, { foreignKey: 'organizationId' });

export default Question;
