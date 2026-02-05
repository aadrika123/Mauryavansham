import { pgTable, serial, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const profileViews = pgTable('profile_views', {
  id: serial('id').primaryKey(),
  profileId: integer('profile_id')
    .references(() => users.id)
    .notNull(), // whose profile was viewed
  viewerId: integer('viewer_id').references(() => users.id), // who viewed (null for anonymous)
  viewerIp: varchar('viewer_ip', { length: 45 }), // IP address for anonymous tracking
  referrer: varchar('referrer', { length: 500 }), // where they came from
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export type ProfileView = typeof profileViews.$inferSelect;
export type NewProfileView = typeof profileViews.$inferInsert;
