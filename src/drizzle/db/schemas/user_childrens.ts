import { pgTable, serial, integer, varchar, text, date } from 'drizzle-orm/pg-core';
import { users } from './users.schema';
// import { users } from "./users";

export const userChildren = pgTable('user_children', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),

  name: varchar('name', { length: 100 }),
  gender: varchar('gender', { length: 10 }), // Son / Daughter
  dateOfBirth: date('date_of_birth'),
  studyingOrWorking: varchar('studying_or_working', { length: 50 }), // "Studying in class 5" / "Software Engineer"
  maritalStatus: varchar('marital_status', { length: 20 }), // 🆕 Added marital status field
  spouseName: varchar('spouse_name', { length: 100 }), // 🆕 Added spouse name field
  details: text('details')
});
