import { pgTable, uuid, varchar, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { apps } from './apps';
import { appVersions } from './appVersions';

export const downloads = pgTable('downloads', {
  id: uuid('id').primaryKey().defaultRandom(),
  app_id: uuid('app_id').references(() => apps.id, { onDelete: 'cascade' }).notNull(),
  version_id: uuid('version_id').references(() => appVersions.id, { onDelete: 'cascade' }).notNull(),
  user_id: uuid('user_id'), 
  
  // Informations du téléchargement
  ip_address: varchar('ip_address', { length: 45 }), // IPv4/IPv6
  user_agent: varchar('user_agent', { length: 500 }),
  country: varchar('country', { length: 2 }), // Code pays ISO
  device_type: varchar('device_type', { length: 50 }), // phone, tablet, tv
  
  // Status du téléchargement
  status: varchar('status', { length: 20 }).default('completed'), // started, completed, failed
  downloaded_at: timestamp('downloaded_at').defaultNow()
}, (table) => ({
  app_download_idx: index('app_download_idx').on(table.app_id, table.downloaded_at),
  user_download_idx: index('user_download_idx').on(table.user_id, table.downloaded_at),
  country_idx: index('country_idx').on(table.country)
}));

export const downloadsRelations = relations(downloads, ({ one }) => ({
  app: one(apps, {
    fields: [downloads.app_id],
    references: [apps.id]
  }),
  version: one(appVersions, {
    fields: [downloads.version_id],
    references: [appVersions.id]
  })
}));

export type Download = typeof downloads.$inferSelect;
export type NewDownload = typeof downloads.$inferInsert;
