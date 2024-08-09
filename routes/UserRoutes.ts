import User from '../models/Users';
import express, { Router, Request, Response } from 'express';

const router = Router();

// Route to get all events
router.get('/get-all', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;