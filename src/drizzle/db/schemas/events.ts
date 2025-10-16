import {
  pgTable,
  serial,
  varchar,
  text,
  date,
  time,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 500 }),
  date: date("date").notNull(),
  fromTime: time("from_time").notNull(),
  toTime: time("to_time").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  attendees: integer("attendees").default(0),
  maxAttendees: integer("max_attendees").notNull(),
  organizer: varchar("organizer", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  category: varchar("category", { length: 100 }),
  isFeatured: boolean("is_featured").default(false),

  // moderation fields 👇
  reason: text("reason"), // rejection reason
  rejectedBy: varchar("rejected_by", { length: 255 }), // kisne reject kiya
  userId: integer("user_id"), // jisne event banaya
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending | approved | rejected

  createdAt: date("created_at").defaultNow(),
  updatedAt: date("updated_at").defaultNow(),
});
