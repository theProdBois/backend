import type { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';

const categoryService = new CategoryService();

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, iconUrl, sortOrder } = req.body;
    const newCategory = await categoryService.createCategory({
      name,
      slug,
      description,
      iconUrl,
      sortOrder
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
