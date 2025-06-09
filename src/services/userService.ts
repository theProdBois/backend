import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import bcrypt from 'bcrypt';
import { usersTable } from '../db/schema';
import type { NewUser, User } from '../db/schema';

export class UserService {
  private db: ReturnType<typeof drizzle>;

  constructor(db: ReturnType<typeof drizzle>) {
    this.db = db;
  }

  async createUser(userData: Omit<NewUser, 'id' | 'password_hash'> & { password: string }): Promise<User> {
    const password_hash = await bcrypt.hash(userData.password, 10);
    
    const newUser: NewUser = {
      ...userData,
      password_hash,
      created_at: new Date(),
      updated_at: new Date()
    };

    const [user] = await this.db.insert(usersTable)
      .values(newUser)
      .returning();

    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db.select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    
    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    const [user] = await this.db.select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return user;
  }

  async findByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await this.db.select()
      .from(usersTable)
      .where(eq(usersTable.google_id, googleId));
    return user;
  }

  async createUserWithGoogle(userData: {
    google_id: string;
    google_email: string;
    google_display_name: string;
    google_photo_url?: string;
    email: string;
    first_name: string;
    last_name: string;
  }): Promise<User> {
    const newUser = {
      ...userData,
      password_hash: '', // Empty password for Google users
      email_verified: true,
      email_verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    };

    const [user] = await this.db.insert(usersTable)
      .values(newUser)
      .returning();

    return user;
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password_hash);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.db.update(usersTable)
      .set({ last_login_at: new Date() })
      .where(eq(usersTable.id, userId));
  }
}
