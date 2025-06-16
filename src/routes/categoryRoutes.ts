import { Router } from 'express';
import { createCategory } from '../controllers/categoryController';

const router = Router();

router.post('/categories', createCategory);

export default router;
