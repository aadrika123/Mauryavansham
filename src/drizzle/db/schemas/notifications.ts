import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // "signup", "approval", etc.
  message: varchar("message", { length: 500 }).notNull(),
  userId: integer("user_id").references(() => users.id), // jis user par notification hai
  senderId: integer("sender_id").references(() => users.id), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
