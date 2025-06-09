import { 
  pgTable, 
  varchar, 
  timestamp, 
  integer,
  uuid
} from "drizzle-orm/pg-core";


export const appScreenshotsTable = pgTable('app_screenshots', {
  id: uuid('id').primaryKey(),
  app_id: integer('app_id').notNull()
    .references(() => appsTable.id, { onDelete: 'cascade' }),

  image_url: varchar('image_url', { length: 500 }).notNull(),
  sort_order: integer('sort_order').default(0),
  alt_text: varchar('alt_text', { length: 255 }),

  created_at: timestamp('created_at').defaultNow()
});
