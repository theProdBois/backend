import express from 'express';
import passport from '../config/passport';
import { GoogleAuthController } from '../controllers/googleAuthController';
import { UserService } from '../services/userService';
import type { drizzle } from 'drizzle-orm/node-postgres';

export function setupGoogleAuthRoutes(db: ReturnType<typeof drizzle>) {
  const router = express.Router();
  const userService = new UserService(db);
  const googleAuthController = new GoogleAuthController(userService);


  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


  router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
    (req, res, next) => {
      Promise.resolve(googleAuthController.handleGoogleCallback(req, res)).catch(next);
    }
  );

  router.get('/google/failure', googleAuthController.handleGoogleFailure);

  return router;
}
