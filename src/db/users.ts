import { 
  pgTable, 
  varchar, 
  timestamp, 
  boolean, 
  date, 
  integer,
  uuid, 
  pgEnum 
} from "drizzle-orm/pg-core";

// Create gender enum
export const genderEnum = pgEnum('gender', ['M', 'F', 'other']);

// Define the users table
export const usersTable = pgTable("users", {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 100 }).notNull(),
  first_name: varchar('first_name', { length: 50 }).notNull(),
  last_name: varchar('last_name', { length: 50 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  date_of_birth: date('date_of_birth'),
  gender: genderEnum('gender'),
  city: varchar('city', { length: 100 }),
  profile_picture_url: varchar('profile_picture_url', { length: 500 }),
  is_active: boolean('is_active').default(true),
  email_verified: boolean('email_verified').default(false),
  email_verified_at: timestamp('email_verified_at'),
  last_login_at: timestamp('last_login_at'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

// Export types for TypeScript support
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
