import { pgTable, serial, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const coachingCenters = pgTable("coaching_centers", {
  id: serial("id").primaryKey(),

  centerName: varchar("center_name", { length: 255 }).notNull(),
  ownerName: varchar("owner_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  pincode: varchar("pincode", { length: 10 }).notNull(),
  courses: jsonb("courses").notNull().default([]),
  branches: jsonb("branches").notNull().default([]),
  // imageUrl: text("image_url"),
  logoUrl: text("logo_url"),
  docUrls: jsonb("doc_urls").notNull().default([]),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // can be 'PENDING', 'APPROVED', 'REJECTED'
  approvedBy: varchar("approved_by", { length: 255 }),
  rejectedBy: varchar("rejected_by", { length: 255 }),
  rejectedReason: text("rejected_reason"),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
