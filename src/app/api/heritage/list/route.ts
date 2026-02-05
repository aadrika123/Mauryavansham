import { db } from '@/src/drizzle/db';
import { heritage } from '@/src/drizzle/schema';

export async function GET() {
  const data = await db.select().from(heritage).orderBy(heritage.order);
  return Response.json(data);
}
