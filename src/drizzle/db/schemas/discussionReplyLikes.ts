import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { discussionReplies } from "./discussionReplies";

export const discussionReplyLikes = pgTable("discussions_reply_likes", {
  id: serial("id").primaryKey(),
  replyId: integer("reply_id")
    .notNull()
    .references(() => discussionReplies.id),
  userId: varchar("user_id", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});