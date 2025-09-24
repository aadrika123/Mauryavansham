import { pgTable, serial, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { discussions } from "./discussions";

export const discussionReplies = pgTable("discussion_replies", {
  id: serial("id").primaryKey(),
  discussionId: integer("discussion_id")
    .notNull()
    .references(() => discussions.id),
  userId: varchar("user_id", { length: 50 }).notNull(),
  userName: varchar("user_name", { length: 100 }).notNull(),
  content: text("content").notNull(),
  parentId: integer("parent_id"), // 👈 Remove the reference for now
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
