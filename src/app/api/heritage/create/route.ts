import { db } from '@/src/drizzle/db';
import { heritage } from '@/src/drizzle/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth'; // adjust path if needed

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const userId = session?.user?.id || null;
    const userName = session?.user?.name || 'Unknown';

    const body = await req.json();
    const { id, title, description, badge, imageUrl, order, isActive } = body;

    if (!title || !description || !imageUrl) {
      return Response.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    if (id) {
      // 🧩 Update record
      await db
        .update(heritage)
        .set({
          title,
          description,
          badge,
          imageUrl,
          order,
          isActive,
          updatedAt: new Date(),
          updatedById: userId,
          updatedByName: userName
        })
        .where(eq(heritage.id, id));

      return Response.json({
        success: true,
        message: 'Heritage updated successfully'
      });
    } else {
      // 🆕 Create new record
      await db.insert(heritage).values({
        title,
        description,
        badge,
        imageUrl,
        order,
        isActive,
        createdById: userId,
        createdByName: userName
      });

      return Response.json({
        success: true,
        message: 'Heritage created successfully'
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
