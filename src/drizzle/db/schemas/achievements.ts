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

// ✅ Updated Enum for category
export const achievementCategoryEnum = pgEnum("achievement_category", [
  "Healthcare",
  "Sports",
  "Technology",
  "Education",
  "Business",
  "Arts",
  "Central Government",
  "PSU",
  "State Government",
  "Other",
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
  fatherName: varchar("father_name", { length: 150 }).notNull(),
  motherName: varchar("mother_name", { length: 150 }).notNull(),
  achievementTitle: varchar("achievement_title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  images: jsonb("images")
    .$type<string[]>()
    .default(sql`'[]'::jsonb`)
    .notNull(),
  category: achievementCategoryEnum("category").notNull(),
  otherCategory: varchar("other_category", { length: 200 }), // ✅ for custom input
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
  updatedBy: varchar("updated_by", { length: 150 }),
  updatedById: varchar("updated_by_id", { length: 100 }),
});
