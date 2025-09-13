import { pgTable, serial, integer, varchar, text, date } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
// import { users } from "./users";

export const userSiblings = pgTable("user_siblings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  name: varchar("name", { length: 100 }).notNull(),
  gender: varchar("gender", { length: 10 }), // Brother / Sister
  dateOfBirth: date("date_of_birth"),        // optional
  occupation: varchar("occupation", { length: 100 }),
  maritalStatus: varchar("marital_status", { length: 20 }), // Married / Unmarried
  details: text("details"), // extra info like "Settled in Mumbai"
});