import { pgTable, uuid, varchar, text, integer, timestamp, boolean, decimal, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { developers } from './developers';
import { categories } from './categories';
import { appVersions } from './appVersions';
import { reviews } from './reviews';
import { downloads } from './downloads';

export const apps = pgTable('apps', {
  id: uuid('id').primaryKey().defaultRandom(),
  package_name: varchar('package_name', { length: 255 }).notNull().unique(), // com.example.app
  name: varchar('name', { length: 255 }).notNull(),
  short_description: varchar('short_description', { length: 160 }),
  full_description: text('full_description'),
  
  // Informations développeur
  developer_id: uuid('developer_id').references(() => developers.id).notNull(),
  developer_name: varchar('developer_name', { length: 255 }).notNull(), // Dénormalisé pour performance
  
  // Catégorisation
  category_id: uuid('category_id').references(() => categories.id).notNull(),
  tags: jsonb('tags').$type<string[]>(), // ['productivity', 'business']
  
  // Statut et modération
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending, approved, rejected, suspended
  moderation_notes: text('moderation_notes'),
  
  // Informations de contenu
  content_rating: varchar('content_rating', { length: 20 }).default('Everyone'), // Everyone, Teen, Mature
  privacy_policy_url: varchar('privacy_policy_url', { length: 500 }),
  
  // Métriques
  download_count: integer('download_count').default(0),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'), // 0.00 à 5.00
  review_count: integer('review_count').default(0),
  
  // Assets (URLs relatives ou chemins)
  icon_url: varchar('icon_url', { length: 500 }),
  feature_graphic_url: varchar('feature_graphic_url', { length: 500 }),
  screenshots: jsonb('screenshots').$type<string[]>(), // URLs des screenshots
  
  // Métadonnées temporelles
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  published_at: timestamp('published_at'),
  last_modified_at: timestamp('last_modified_at').defaultNow()
}, (table) => ({
  package_name_idx: index('package_name_idx').on(table.package_name),
  developer_idx: index('developer_idx').on(table.developer_id),
  category_idx: index('category_idx').on(table.category_id),
  status_idx: index('status_idx').on(table.status),
  rating_idx: index('rating_idx').on(table.rating),
  published_at_idx: index('published_at_idx').on(table.published_at)
}));

// Include existing appScreenshotsTable from the current apps.ts
export const appScreenshots = pgTable('app_screenshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  app_id: uuid('app_id').notNull()
    .references(() => apps.id, { onDelete: 'cascade' }),
  image_url: varchar('image_url', { length: 500 }).notNull(),
  sort_order: integer('sort_order').default(0),
  alt_text: varchar('alt_text', { length: 255 }),
  created_at: timestamp('created_at').defaultNow()
});

export const appsRelations = relations(apps, ({ one, many }) => ({
  developer: one(developers, {
    fields: [apps.developer_id],
    references: [developers.id]
  }),
  category: one(categories, {
    fields: [apps.category_id],
    references: [categories.id]
  }),
  versions: many(appVersions),
  reviews: many(reviews),
  downloads: many(downloads),
  screenshots: many(appScreenshots)
}));

export const appScreenshotsRelations = relations(appScreenshots, ({ one }) => ({
  app: one(apps, {
    fields: [appScreenshots.app_id],
    references: [apps.id]
  })
}));

export type App = typeof apps.$inferSelect;
export type NewApp = typeof apps.$inferInsert;

export type AppScreenshot = typeof appScreenshots.$inferSelect;
export type NewAppScreenshot = typeof appScreenshots.$inferInsert;
