import { pgTable, serial, varchar, text, integer, timestamp, pgEnum, boolean } from "drizzle-orm/pg-core";

export const discussionStatusEnum = pgEnum("discussion_status", [
  "pending",
  "approved",
  "rejected",
]);

export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  authorId: varchar("author_id", { length: 50 }).notNull(),
  authorName: varchar("author_name", { length: 100 }).notNull(),
  location: varchar("location", { length: 100 }),
  userId: integer("user_id"),

  // counters
  likes: integer("likes").default(0).notNull(),
  replies: integer("replies").default(0).notNull(),
  replyCount: integer("reply_count").default(0).notNull(),

  // status
  status: discussionStatusEnum("status").default("pending").notNull(),

  // approval info
  approvedBy: varchar("approved_by", { length: 50 }),
  approvedById: varchar("approved_by_id", { length: 50 }),
  approvedAt: timestamp("approved_at"),

  // rejection info
  rejectedBy: varchar("rejected_by", { length: 50 }),
  rejectedById: varchar("rejected_by_id", { length: 50 }),
  rejectedAt: timestamp("rejected_at"),
  rejectionReason: text("rejection_reason"),
  isCompleted: boolean("is_completed").default(false).notNull(),


  // audit
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
