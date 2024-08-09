import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import sequelize from './config/database';
import User from './models/Users';
import dotenv from 'dotenv-flow';
import { createMockUsers } from './utility';
import userRoute from './routes/UserRoutes';

dotenv.config();

const app : Express = express();

app.use(bodyParser.json());
app.use('/api/users', userRoute)

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// Function to add sample data
const addSampleData = async () => {
  try {
    const userCount = await User.count();
    if (userCount === 0) {
        await createMockUsers();
    }
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
