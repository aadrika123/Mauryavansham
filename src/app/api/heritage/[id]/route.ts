import { db } from '@/src/drizzle/db';
import { heritage } from '@/src/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await db
    .select()
    .from(heritage)
    .where(eq(heritage.id, Number(id)))
    .limit(1);

  if (!data.length)
    return Response.json({ message: 'Not found' }, { status: 404 });

  return Response.json(data[0]);
}
