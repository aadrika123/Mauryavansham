// import MatrimonialPage from "./MatrimonialPage";
import { db } from '@/src/drizzle/db';
import { profiles } from '@/src/drizzle/schema';
import MatrimonialPage from './matrimonialDetailsPage';
import { eq } from 'drizzle-orm';

export default async function MatrimonialSSR() {
  // ✅ sirf basic info fetch kar rahe hain
  const initialProfiles = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      age: profiles.dob, // ya dob se age nikalna hoga
      location: profiles.workLocation,
      education: profiles.highestEducation,
      occupation: profiles.occupation,
      profileImage: profiles.profileImage,
      isVerified: profiles.isVerified,
      deactivateReview: profiles.deactivateReview,
      deactivateReason: profiles.deactivateReason,
      createdAt: profiles.createdAt,
      updatedAt: profiles.updatedAt
    })
    .from(profiles)
    .where(eq(profiles.deactivateReason, 'married'))
    .limit(10);
  console.log('Initial Profiles:', initialProfiles);

  return <MatrimonialPage initialProfiles={initialProfiles as any} />;
}
