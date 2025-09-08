import { pgTable, serial, integer, uniqueIndex } from "drizzle-orm/pg-core";

// Table definition with unique index
export const event_attendees = pgTable(
  "event_attendees",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id").notNull(),
    userId: integer("user_id").notNull(),
  },
  (table) => ({
    uniqueEventUser: uniqueIndex("unique_event_user", [table.eventId, table.userId]),
  })
);
