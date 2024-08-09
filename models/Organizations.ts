import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Organization = sequelize.define('Organization', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Organizations'
});

export default Organization;
