import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Organization from './Organizations';
import User from './Users';

const Case = sequelize.define('Case', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Organization,
            key: 'id'
        }
    },
    approved: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
}, {
    tableName: 'Cases'
});

// Define relationships
Case.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Case, { foreignKey: 'userId' });

Case.belongsTo(Organization, { foreignKey: 'organizationId' });
Organization.hasMany(Case, { foreignKey: 'organizationId' });

export default Case;
