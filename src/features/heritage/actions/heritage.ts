'use server';

import { db } from '@/src/drizzle/db';
import { heritageContent } from '@/src/features/heritage/db/heritage';
import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';

export async function submitHeritageContribution(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const contentType = formData.get('contentType') as string;
  // ... extract other fields

  if (!title || !description || !contentType) {
    return { success: false, message: 'Missing required fields for heritage contribution.' };
  }

  try {
    const [newContribution] = await db
      .insert(heritageContent)
      .values({
        title,
        content: description, // Mapping description to content for now
        contentType: contentType as any, // Cast to enum type
        // ... other fields
        isPublished: false // Contributions are pending review by default
      })
      .returning();
    revalidatePath('/heritage');
    return { success: true, message: 'Heritage contribution submitted for review!', contribution: newContribution };
  } catch (error) {
    console.error('Error submitting heritage contribution:', error);
    return { success: false, message: 'Failed to submit heritage contribution.' };
  }
}

export async function getHeritageContent(contentType?: string) {
  try {
    const conditions = [eq(heritageContent.isPublished, true)];
    if (contentType) {
      conditions.push(eq(heritageContent.contentType, contentType as any));
    }

    const content = await db
      .select()
      .from(heritageContent)
      .where(and(...conditions));
    return { success: true, content };
  } catch (error) {
    console.error('Error fetching heritage content:', error);
    return { success: false, message: 'Failed to fetch heritage content.', content: [] };
  }
}
