import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import sequelize from './config/database';
import User from './models/Users';
import dotenv from 'dotenv-flow';
import { generateMockData } from './utility/mock';
import userRoute from './routes/UserRoutes';
import caseRoute from './routes/CaseRoutes';
import questionRoute from './routes/QuestionRoutes';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app : Express = express();

const swaggerPath = path.join(__dirname, 'swagger.yaml');
const swaggerFile = yaml.load(fs.readFileSync(swaggerPath, 'utf8'));

app.use(bodyParser.json());
app.use('/api/users', userRoute);
app.use('/api/cases', caseRoute);
app.use('/api/questions', questionRoute);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// Function to add sample data
const addSampleData = async () => {
  try {
    await generateMockData();
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
};

// Sync database and start server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(async () => {
  await addSampleData(); // Add sample data if the database is empty
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
