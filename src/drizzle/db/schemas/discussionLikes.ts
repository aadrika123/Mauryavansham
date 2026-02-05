import { pgTable, serial, varchar, timestamp, integer } from 'drizzle-orm/pg-core';
import { discussions } from './discussions'; // 👈 import karna hoga

export const discussionLikes = pgTable('discussion_likes', {
  id: serial('id').primaryKey(),
  discussionId: integer('discussion_id')
    .notNull()
    .references(() => discussions.id), // 👈 ab chalega
  userId: varchar('user_id', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
