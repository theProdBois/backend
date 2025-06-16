import type { Request, Response } from 'express';
import { DeveloperService } from '../services/developerService';

const developerService = new DeveloperService();

export const createDeveloper = async (req: Request, res: Response) => {
  try {
    const { name, email, company, website, verified } = req.body;
    const newDeveloper = await developerService.createDeveloper({
      name,
      email,
      company,
      website,
      verified
    });
    res.status(201).json(newDeveloper);
  } catch (error) {
    console.error('Error creating developer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
