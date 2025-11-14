import { pgTable, serial, varchar, boolean, integer, text, timestamp } from "drizzle-orm/pg-core";

export const heritage = pgTable("heritage", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  badge: varchar("badge", { length: 100 }),
  imageUrl: text("image_url").notNull(),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),

  createdById: varchar("created_by_id", { length: 50 }),
  createdByName: varchar("created_by_name", { length: 100 }),
  updatedById: varchar("updated_by_id", { length: 50 }),
  updatedByName: varchar("updated_by_name", { length: 100 }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
