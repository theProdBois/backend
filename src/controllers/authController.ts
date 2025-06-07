import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  register = async (req: Request, res: Response) => {
    try {
      const { 
        email, 
        password, 
        first_name, 
        last_name, 
        phone, 
        date_of_birth, 
        gender,
        city,
        profile_picture_url 
      } = req.body;

      // Check if user already exists
      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create new user
      const user = await this.userService.createUser({
        email,
        password,
        first_name,
        last_name,
        phone,
        date_of_birth: date_of_birth ? new Date(date_of_birth).toISOString() : null,
        gender,
        city,
        profile_picture_url
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await this.userService.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await this.userService.verifyPassword(user, password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Update last login
      await this.userService.updateLastLogin(user.id);

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
