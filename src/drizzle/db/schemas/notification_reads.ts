import { pgTable, serial, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { notifications } from './notifications';

export const notification_reads = pgTable('notification_reads', {
  id: serial('id').primaryKey(),
  notificationId: integer('notification_id').references(() => notifications.id),
  adminId: integer('admin_id').notNull(),
  markAllRead: boolean('mark_all_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
