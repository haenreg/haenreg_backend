// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'mydatabase',   // Database name
  'user',         // Database username
  'userpassword', // Database password
  {
    host: 'localhost', // Docker container host
    dialect: 'mysql',
    port: 3306         // Docker container port
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
