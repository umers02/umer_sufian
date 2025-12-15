import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';

interface DecodedToken extends JwtPayload {
  id: string;
}

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.status(401).json({ message: 'Invalid token.' });
      return;
    }

    req.user = { id: user._id.toString(), email: user.email };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export default auth;