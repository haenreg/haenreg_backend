import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Organization from './Organizations';

const User = sequelize.define('User', {
    username: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Organization,
            key: 'id'
        }
    },
    isOrgLeader: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'Users'
});

// Define the relationship between User and Organization
User.belongsTo(Organization, { foreignKey: 'organizationId' });
Organization.hasMany(User, { foreignKey: 'organizationId' });

export default User;
