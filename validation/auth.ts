import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { iUser } from '../interfaces/iUser';

declare module 'express-serve-static-core' {
  interface Request {
    user?: iUser; // Adjust the type to match your user object structure
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user; // Attach user information to request
    next();
  });
};

export const verifyIsLeader = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403); // Forbidden
        if (!user.isOrgLeader) return res.sendStatus(403); // Forbidden
        req.user = user; // Attach user information to request
        next();
    });
}
