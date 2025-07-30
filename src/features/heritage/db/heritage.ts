import { pgTable, serial, varchar, text, timestamp, date, integer, boolean, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { users } from "@/src/drizzle/schema" // Updated import path

// Define ENUMs for heritage content types
export const heritageContentTypeEnum = pgEnum("heritage_content_type", [
  "article",
  "timeline_event",
  "biography",
  "tradition",
  "location",
  "family_story",
  "historical_document",
  "photograph",
  "oral_history",
  "cultural_practice",
  "genealogy",
])

// Heritage content table
export const heritageContent = pgTable("heritage_content", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  contentType: heritageContentTypeEnum("content_type").notNull(),
  category: varchar("category", { length: 100 }),
  historicalDate: date("historical_date"),
  location: varchar("location", { length: 255 }),
  mediaFiles: text("media_files"), // JSON array of media URLs
  authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
  isPublished: boolean("is_published").default(false),
  featuredOrder: integer("featured_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// Relations for heritage content
export const heritageContentRelations = relations(heritageContent, ({ one }) => ({
  author: one(users, { fields: [heritageContent.authorId], references: [users.id] }),
}))
