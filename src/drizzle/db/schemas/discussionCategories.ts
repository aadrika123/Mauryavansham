import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const discussionCategories = pgTable("discussion_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").default("active").notNull(), // active / inactive
});
