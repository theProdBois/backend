import { Router } from 'express';
import { createDeveloper } from '../controllers/developerController';

const router = Router();

router.post('/developers', createDeveloper);

export default router;
