import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();


export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const setupAuthRoutes = (authController: AuthController) => {
  // Register new user
  router.post('/register', authController.register);


  router.post('/login', authController.login);

  router.get('/me', authenticateToken, (req: Request, res: Response) => {
    res.json({ user: req.user });
  });

  return router;
};
