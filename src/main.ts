import 'dotenv/config';
import express from 'express';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { UserService } from './services/userService';
import { AuthController } from './controllers/authController';
import { setupAuthRoutes } from './routes/authRoutes';

const app = express();
app.use(express.json());

// Database setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const db = drizzle(pool);

// Initialize services and controllers
const userService = new UserService(db);
const authController = new AuthController(userService);

// Setup routes
app.use('/auth', setupAuthRoutes(authController));

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
