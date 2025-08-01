import { pgTable, serial, varchar, boolean, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 15 }),
  role: varchar("role", { length: 20 }).default("user"), // user, admin, premium
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  profileId: serial("profile_id"), // Link to profiles table
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
