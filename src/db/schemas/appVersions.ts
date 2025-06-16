import { pgTable, uuid, varchar, text, integer, timestamp, decimal, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { apps } from './apps';
import { downloads } from './downloads';

export const appVersions = pgTable('app_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  app_id: uuid('app_id').references(() => apps.id, { onDelete: 'cascade' }).notNull(),
  
  // Informations de version
  version_name: varchar('version_name', { length: 50 }).notNull(), // "1.0.0"
  version_code: integer('version_code').notNull(), // 1, 2, 3... (doit être croissant)
  
  // Informations du fichier
  file_name: varchar('file_name', { length: 255 }).notNull(), // nom du fichier APK/AAB
  file_path: varchar('file_path', { length: 500 }).notNull(), // chemin relatif sur le serveur
  file_size: integer('file_size').notNull(), // taille en bytes
  file_hash: varchar('file_hash', { length: 64 }).notNull(), // SHA-256 du fichier
  mime_type: varchar('mime_type', { length: 100 }).default('application/vnd.android.package-archive'),
  
  // Informations techniques
  min_sdk_version: integer('min_sdk_version'), // API level minimum
  target_sdk_version: integer('target_sdk_version'), // API level ciblé
  supported_abis: jsonb('supported_abis').$type<string[]>(), // ['arm64-v8a', 'armeabi-v7a']
  permissions: jsonb('permissions').$type<string[]>(), // Permissions demandées
  
  // Release notes
  release_notes: text('release_notes'),
  release_notes_language: varchar('release_notes_language', { length: 10 }).default('en'),
  
  // Statut
  status: varchar('status', { length: 50 }).notNull().default('draft'), // draft, testing, production, rollback
  rollout_percentage: integer('rollout_percentage').default(100), // 0-100%
  
  // Métriques
  download_count: integer('download_count').default(0),
  crash_rate: decimal('crash_rate', { precision: 5, scale: 4 }).default('0.0000'),
  
  // Métadonnées temporelles
  created_at: timestamp('created_at').defaultNow(),
  published_at: timestamp('published_at'),
  archived_at: timestamp('archived_at')
}, (table) => ({
  app_version_idx: index('app_version_idx').on(table.app_id, table.version_code),
  app_status_idx: index('app_status_idx').on(table.app_id, table.status),
  published_at_idx: index('version_published_at_idx').on(table.published_at)
}));

export const appVersionsRelations = relations(appVersions, ({ one, many }) => ({
  app: one(apps, {
    fields: [appVersions.app_id],
    references: [apps.id]
  }),
  downloads: many(downloads)
}));

export type AppVersion = typeof appVersions.$inferSelect;
export type NewAppVersion = typeof appVersions.$inferInsert;
