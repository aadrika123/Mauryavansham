import { pgTable, serial, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { discussions } from "./discussions"; // 👈 import karna hoga

export const discussionReplies = pgTable("discussion_replies", {
  id: serial("id").primaryKey(),
  discussionId: integer("discussion_id")
    .notNull()
    .references(() => discussions.id), // 👈 ab chalega
  userId: varchar("user_id", { length: 50 }).notNull(),
  userName: varchar("user_name", { length: 100 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
