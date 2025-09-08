import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { notifications } from "./notifications";

export const notification_reads = pgTable("notification_reads", {
  id: serial("id").primaryKey(),
  notificationId: integer("notification_id").references(() => notifications.id).notNull(),
  adminId: integer("admin_id").notNull(), // logged-in admin id
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
