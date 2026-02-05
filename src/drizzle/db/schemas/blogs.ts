import { pgTable, text, timestamp, integer, serial, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const blogStatusEnum = pgEnum('blog_status', ['draft', 'pending', 'approved', 'rejected', 'removed']);

export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  summary: text('summary').notNull(),
  authorId: integer('author_id')
    .references(() => users.id)
    .notNull(),
  imageUrl: text('image_url').notNull(),
  status: blogStatusEnum('status').default('draft').notNull(),
  rejectionReason: text('rejection_reason'),
  views: integer('views').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  approvedAt: timestamp('approved_at'),
  removeReason: text('remove_reason'),
  removedBy: integer('removed_by').references(() => users.id)
});

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
