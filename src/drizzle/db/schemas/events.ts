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
  fromTime: time("from_time").notNull(), // 👈 start time
  toTime: time("to_time").notNull(), // 👈 end time
  location: varchar("location", { length: 255 }).notNull(),
  attendees: integer("attendees").default(0), // auto increase when users mark attending
  maxAttendees: integer("max_attendees").notNull(),
  organizer: varchar("organizer", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // In-Person, Virtual, Hybrid
  category: varchar("category", { length: 100 }),
  isFeatured: boolean("is_featured").default(false),
});
