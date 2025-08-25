// src/drizzle/schema/adPlacements.ts
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const adPlacements = pgTable("ad_placements", {
  id: serial("id").primaryKey(),
  pageName: varchar("page_name", { length: 100 }).notNull(),
  sectionName: varchar("section_name", { length: 100 }).notNull(),
  description: text("description").default(""),
});
