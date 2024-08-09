import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Organization from './Organizations';

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Organization,
            key: 'id'
        }
    }
}, {
    tableName: 'Users'
});

export default User;
