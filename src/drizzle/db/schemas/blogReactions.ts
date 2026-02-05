import { pgTable, serial, integer, varchar, boolean, timestamp, text, uniqueIndex } from 'drizzle-orm/pg-core';

export const blogReactions = pgTable(
  'blog_reactions',
  {
    id: serial('id').primaryKey(),
    blogId: integer('blog_id').notNull(),
    userId: varchar('user_id').notNull(),
    comment: text('comment'),
    parentId: integer('parent_id'),
    targetType: varchar('target_type').notNull(), // 'blog' | 'comment'
    isLiked: boolean('is_liked').default(false),
    isDisliked: boolean('is_disliked').default(false),
    createdAt: timestamp('created_at').defaultNow()
  },
  table => ({
    // 🧩 Prevent duplicate reactions by same user on same target
    uniqueReaction: uniqueIndex('unique_reaction_index').on(
      table.blogId,
      table.userId,
      table.targetType,
      table.parentId
    )
  })
);
