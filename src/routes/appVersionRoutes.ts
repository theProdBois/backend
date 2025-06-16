import { Router } from 'express';
import { createAppVersion } from '../controllers/appVersionController';

const router = Router();

router.post('/appVersions', createAppVersion);

export default router;
