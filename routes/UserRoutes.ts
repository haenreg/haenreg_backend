import User from '../models/Users';
import express, { Router, Request, Response } from 'express';
import { authenticateToken, verifyIsLeader } from '../validation/auth';
import bcrypt from 'bcrypt';
import { iUser } from '../interfaces/iUser';
import jwt from 'jsonwebtoken';
import { loginValidation } from '../validation/validation';
import Organization from '../models/Organizations';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '1h';

// Route to get all events
router.get('/get-all', verifyIsLeader,  async (req: Request, res: Response) => {
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

    const org = await Organization.findByPk(user.organizationId) as any;

    // Compare the provided password with the stored hash
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const jwtData: iUser = { 
      id: user.id,
      username: user.username,
      organizationId: user.organizationId
    };

    if (user.isOrgLeader) {
      jwtData.isOrgLeader = true;
    }

    const token = jwt.sign(
      jwtData,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    return res.status(200).json({ message: 'Login successful', token, username: user.username, organization: org.name });

  } catch (error: any) {
    res.status(500).json({
      Title: 'Something went wrong when logging in',
      Message: error.message,
    });
  }
});

router.get('/fetch-user', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    // Fetch the user from the database
    const user = await User.findByPk(userId) as unknown as iUser;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const org = await Organization.findByPk(user.organizationId) as any;

    // Return the same user data as in login
    return res.status(200).json({ 
      username: user.username, 
      organization: org.name,
      isOrgLeader: user.isOrgLeader 
    });

  } catch (error: any) {
    res.status(500).json({
      Title: 'Something went wrong when fetching user data',
      Message: error.message,
    });
  }
});

export default router;