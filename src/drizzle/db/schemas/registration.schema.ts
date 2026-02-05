import { pgTable, serial, integer, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const members = pgTable('members', {
  registrationId: serial('registration_id').primaryKey(), // ✅ Primary Key
  familyHeadName: varchar('family_head_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 20 }).unique(),
  gotra: varchar('gotra', { length: 100 }),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 255 }).default('India'),
  occupation: varchar('occupation', { length: 100 }),
  businessName: varchar('business_name', { length: 100 }),
  familyMembers: integer('family_members').default(0),
  agreeToTerms: boolean('agree_to_terms').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  roles: varchar('roles', { length: 50 }).default('member')
});
