import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  date,
  serial,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { adPlacements } from "./adPlacements";

export const adStatusEnum = pgEnum("ad_status", [
  "pending",
  "approved",
  "rejected",
  "expired",
]);

export const ads = pgTable("ads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  bannerImageUrl: text("banner_image_url").notNull(),
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  status: adStatusEnum("status").default("pending").notNull(),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  approvedAt: timestamp("approved_at"),
  placementId: integer("placement_id")
    .references(() => adPlacements.id)
    .notNull(),
});

export type Ad = typeof ads.$inferSelect;
export type NewAd = typeof ads.$inferInsert;
