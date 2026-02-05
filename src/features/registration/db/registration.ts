import { members } from '@/src/drizzle/db/schemas/registration.schema';
import { db } from '@/src/drizzle/db';

// Insert
export async function insertRegistration(data: typeof members.$inferInsert) {
  const [newRegistration] = await db.insert(members).values(data).returning();
  return newRegistration;
}
