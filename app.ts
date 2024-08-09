import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import sequelize from './config/database';
import Event from './models/Events';
import dotenv from 'dotenv-flow';

dotenv.config();

const app : Express = express();

app.use(bodyParser.json());

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// Route to create an event
app.post('/events', async (req: Request, res: Response) => {
  const { title, description, date } = req.body;
  try {
    const event = await Event.create({ title, description, date });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Route to get all events
app.get('/events', async (req: Request, res: Response) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Function to add sample data
const addSampleData = async () => {
  try {
    const count = await Event.count();
    if (count === 0) {
      /* await Event.create({ title: 'Event 1', description: 'Description for event 1', date: new Date() });
      await Event.create({ title: 'Event 2', description: 'Description for event 2', date: new Date() });
      await Event.create({ title: 'Event 3', description: 'Description for event 3', date: new Date() }); */
      console.log('Sample data added successfully.');
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
