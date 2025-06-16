import { Router } from 'express';
import { addApp, listAllApks, listApksByCategory } from '../controllers/appController';

const router = Router();

router.post('/apps', addApp);
router.get('/apks', listAllApks);
router.get('/apks/category/:categoryId', listApksByCategory);

export default router;
