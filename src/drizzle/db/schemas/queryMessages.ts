// src/drizzle/schema/queryMessages.ts
import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const queryMessages = pgTable("query_messages", {
  id: serial("id").primaryKey(),
  senderId: varchar("sender_id", { length: 50 }).notNull(),
  receiverId: varchar("receiver_id", { length: 50 }).notNull(),
  text: text("text").notNull(),
  queryType: varchar("query_type", { length: 50 }).notNull().default("general"), // e.g., education, support, business
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
