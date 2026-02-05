import { profiles } from '@/src/drizzle/db/schemas/createProfile.schema';
import { db } from '@/src/drizzle/db';
// Insert
export async function insertProfile(data: typeof profiles.$inferInsert) {
  const [newProfile] = await db.insert(profiles).values(data).returning();
  return newProfile;
}
