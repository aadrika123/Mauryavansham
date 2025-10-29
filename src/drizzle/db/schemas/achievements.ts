import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  jsonb,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ✅ Enum for category
export const achievementCategoryEnum = pgEnum("achievement_category", [
  "Healthcare",
  "Sports",
  "Technology",
  "Education",
  "Business",
  "Arts",
]);

// ✅ Enum for status
export const achievementStatusEnum = pgEnum("achievement_status", [
  "active",
  "inactive",
  "removed",
]);

// ✅ Achievements table
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  category: achievementCategoryEnum("category").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isHallOfFame: boolean("is_hall_of_fame").default(false).notNull(),
  year: integer("year").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  keyAchievement: text("key_achievement").notNull(),
  impact: text("impact").notNull(),
  achievements: jsonb("achievements")
    .$type<string[]>()
    .default(sql`'[]'::jsonb`)
    .notNull(),
  status: achievementStatusEnum("status").default("active").notNull(),
  createdBy: varchar("created_by", { length: 150 }).notNull(),
  createdById: varchar("created_by_id", { length: 100 }).notNull(),
  removedBy: varchar("removed_by", { length: 150 }),
  removedById: varchar("removed_by_id", { length: 100 }),
  removedAt: timestamp("removed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  reason: text("reason"),
});
