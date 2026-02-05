import { pgTable, serial, varchar, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '@/src/drizzle/schema'; // Updated import path

// Define ENUMs for discussion categories
export const discussionCategoryEnum = pgEnum('discussion_category', [
  'business_help',
  'community_connect',
  'culture_traditions',
  'education',
  'matrimonial_advice',
  'health_wellness',
  'other'
]);

// Define the discussions table
export const discussions = pgTable('discussions', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  category: discussionCategoryEnum('category').notNull(),
  location: varchar('location', { length: 255 }),
  repliesCount: integer('replies_count').default(0).notNull(),
  likesCount: integer('likes_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull()
});

// Define relations for discussions
export const discussionsRelations = relations(discussions, ({ one, many }) => ({
  author: one(users, { fields: [discussions.authorId], references: [users.id] })
  // replies: many(discussionReplies), // If you add a replies table
}));
