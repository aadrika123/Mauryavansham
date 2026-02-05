import { pgTable, serial, integer, timestamp } from 'drizzle-orm/pg-core';

export const connections = pgTable('connections', {
  id: serial('id').primaryKey(),
  user1Id: integer('user1_id').notNull(), // jo connect back kar raha
  user2Id: integer('user2_id').notNull(), // jisko connect back hua
  createdAt: timestamp('created_at').defaultNow()
});
