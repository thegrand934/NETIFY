import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { getJwtSecret } from '../config/jwt';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, getJwtSecret()) as { id: string; tokenVersion?: number };

      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      if ((decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
        res.status(401).json({ message: 'Not authorized, session expired' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
