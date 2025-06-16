import { pgTable, uuid, varchar, text, integer, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { apps } from './apps';

export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  app_id: uuid('app_id').references(() => apps.id, { onDelete: 'cascade' }).notNull(),
  user_id: uuid('user_id').notNull(), // Référence vers table users (à créer)
  
  rating: integer('rating').notNull(), // 1-5 étoiles
  title: varchar('title', { length: 100 }),
  comment: text('comment'),
  
  // Métadonnées de l'avis
  app_version_code: integer('app_version_code'), // Version testée
  device_model: varchar('device_model', { length: 100 }),
  android_version: varchar('android_version', { length: 20 }),
  
  // Modération
  is_moderated: boolean('is_moderated').default(false),
  is_helpful: boolean('is_helpful').default(true),
  helpful_count: integer('helpful_count').default(0),
  
  // Métadonnées temporelles
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
}, (table) => ({
  app_rating_idx: index('app_rating_idx').on(table.app_id, table.rating),
  user_app_idx: index('user_app_idx').on(table.user_id, table.app_id),
  created_at_idx: index('review_created_at_idx').on(table.created_at)
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  app: one(apps, {
    fields: [reviews.app_id],
    references: [apps.id]
  })
}));

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
