import { pgTable, uuid, varchar, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { apps } from './apps';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon_url: varchar('icon_url', { length: 500 }),
  sort_order: integer('sort_order').default(0)
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  apps: many(apps)
}));

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
