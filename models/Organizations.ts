import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Organization = sequelize.define('Organization', {
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'Organizations'
});

export default Organization;
