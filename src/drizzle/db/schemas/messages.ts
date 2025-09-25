import { pgTable, serial, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  text: varchar("text", { length: 1000 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
