import User from '../models/Users';
import express, { Router, Request, Response } from 'express';
import { loginValidation } from '../validation/auth';
import bcrypt from 'bcrypt';
import { iUser } from '../interfaces/iUser';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

// Route to get all events
router.get('/get-all', async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post('/login', async (req, res) => {
  try {

    const data = req.body;
    console.log(data);
    

    const { error } = loginValidation(data);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, password } = data;

    // Find the user by username
    const user = await User.findOne({ where: { username } }) as unknown as iUser;
    if (!user || !user.password) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Compare the provided password with the stored hash
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, organizationId: user.organizationId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.status(200).json({ message: 'Login successful', token });

  } catch (error: any) {
    res.status(500).json({
      Title: 'Something went wrong when logging in',
      Message: error.message,
    });
  }
});

export default router;