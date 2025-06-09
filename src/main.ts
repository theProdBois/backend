import 'dotenv/config';
import express, { static as expressStatic } from 'express';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { UserService } from './services/userService';
import { AuthController } from './controllers/authController';
import { setupAuthRoutes } from './routes/authRoutes';
import { setupGoogleAuthRoutes } from './routes/googleAuthRoutes';
import passport from './config/passport';
import session from 'express-session';

const app = express();
app.use(express.json());
app.use(expressStatic('public'));

// Session middleware configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());


const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const db = drizzle(pool);

const userService = new UserService(db);
const authController = new AuthController(userService);


app.use('/auth', setupAuthRoutes(authController));
app.use('/auth', setupGoogleAuthRoutes(db));


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
