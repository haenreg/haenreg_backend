import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    organization: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

export default User;