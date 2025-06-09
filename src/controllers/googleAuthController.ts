import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';

const JWT_SECRET = process.env.JWT_SECRET;

export class GoogleAuthController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  handleGoogleCallback = async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      if (!user) {
        return res.status(401).json({ error: 'Authentication failed' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

      await this.userService.updateLastLogin(user.id);

      res.redirect(`/?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        google_id: user.google_id,
        google_photo_url: user.google_photo_url
      }))}`);
    } catch (error) {
      console.error('Google callback error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  handleGoogleFailure = (req: Request, res: Response) => {
    res.redirect('/?error=Authentication failed');
  };
}
