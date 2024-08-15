import { Sequelize } from 'sequelize';
import dotenv from 'dotenv-flow';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,   // Database name
  process.env.DB_USERNAME as string, // Database username
  process.env.DB_USER_PASSWORD as string, // Database password
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
    console.log(process.env.DB_NAME);
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
