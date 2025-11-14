import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  comment: text("comment"),
  enquireType: varchar("enquireType", { length: 50 }),
  senderUserId: varchar("senderUserId", { length: 50 }),
  receiverUserId: varchar("receiverUserId", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow(),
});
