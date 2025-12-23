import { pgTable, serial, integer, varchar, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users.schema";

export const userApprovals = pgTable("user_approvals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  adminId: integer("admin_id")
    .notNull()
    .references(() => users.id),
  adminName: varchar("admin_name", { length: 100 }).notNull(), // 👈 new field
  status: varchar("status", { length: 20 }).default("approved"),
  createdAt: timestamp("created_at").defaultNow(),
  reason: varchar("reason", { length: 255 }),
});
