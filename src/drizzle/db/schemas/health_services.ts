import { pgTable, serial, varchar, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const healthServices = pgTable('health_services', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 64 }),

  // General name instead of serviceName
  centerName: varchar('center_name', { length: 255 }).notNull(),

  category: varchar('category', { length: 100 }).notNull(), // NEW FIELD

  ownerName: varchar('owner_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 15 }).notNull(),

  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  pincode: varchar('pincode', { length: 10 }),

  // For listing services/activities offered
  offerings: jsonb('offerings').$type<string[]>().notNull().default([]),

  branches: jsonb('branches').$type<{ name: string; address: string; phone: string }[]>().default([]),

  about: text('about'),

  logoUrl: text('logo_url'),
  docUrls: jsonb('doc_urls').$type<string[]>().default([]),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
