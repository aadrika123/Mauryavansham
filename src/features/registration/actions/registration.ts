'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { db } from '@/src/drizzle/db';
import { members } from '@/src/drizzle/db/schemas/registration.schema';

export async function createRegistration(prevState: any, formData: FormData) {
  try {
    // ✅ Zod schema validation
    const registrationSchema = z.object({
      familyHeadName: z.string().min(1, 'Family Head Name is required'),
      email: z.string().email('Invalid email address'),
      phone: z.string().optional(),
      gotra: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      occupation: z.string().optional(),
      businessName: z.string().optional(),
      familyMembers: z.coerce.number().optional(),
      agreeToTerms: z.coerce.boolean().optional(),
      roles: z.string().optional()
    });

    const parsedData = registrationSchema.parse({
      familyHeadName: formData.get('familyHeadName') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      gotra: formData.get('gotra') || '',
      address: formData.get('address') || '',
      city: formData.get('city') || '',
      state: formData.get('state') || '',
      country: formData.get('country') || '',
      occupation: formData.get('occupation') || '',
      businessName: formData.get('businessName') || '',
      familyMembers: formData.get('familyMembers') ? Number(formData.get('familyMembers')) : undefined,
      agreeToTerms: formData.get('agreeToTerms') === 'on',
      roles: 'member'
    });

    // ✅ Check if email already exists
    const existing = await db.query.members.findFirst({
      where: (fields, { eq }) => eq(fields.email, parsedData.email)
    });

    if (existing) {
      return {
        success: false,
        message: 'Registration already exists for this email.',
        data: existing,
        timestamp: Date.now()
      };
    }

    // ✅ Insert data into DB
    await db.insert(members).values({
      familyHeadName: parsedData.familyHeadName,
      email: parsedData.email,
      phone: parsedData.phone,
      gotra: parsedData.gotra,
      address: parsedData.address,
      city: parsedData.city,
      state: parsedData.state,
      country: parsedData.country,
      occupation: parsedData.occupation,
      businessName: parsedData.businessName,
      familyMembers: parsedData.familyMembers,
      agreeToTerms: parsedData.agreeToTerms,
      createdAt: new Date()
    });

    revalidatePath('/registration/list'); // if using a read/listing page
    return {
      success: true,
      message: 'Registration successful',
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error creating registration:', error);
    return {
      success: false,
      message: 'Failed to register, please try again later.',
      error: error,
      timestamp: Date.now()
    };
  }
}
