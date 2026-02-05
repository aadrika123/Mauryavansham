import type { DatabaseProfile, Profile } from '../type';

export function transformDatabaseProfileToProfile(dbProfile: DatabaseProfile): Profile | null {
  // Skip profiles with missing essential data
  if (!dbProfile.name) {
    console.log(`Skipping profile ${dbProfile.id}: missing name`);
    return null;
  }

  // Extract age from height or other fields (you might need to add age field to your schema)
  // For now, we'll use a placeholder or derive from other data
  const age = dbProfile.dob ? calculateAge(dbProfile.dob) : null;

  if (!age) {
    console.log(`Skipping profile ${dbProfile.id}: cannot determine age`);
    return null;
  }

  // Parse interests from hobbies and other preference fields
  const interests = extractInterests(dbProfile);

  // Extract location from work location or other fields
  const location = dbProfile.workLocation || dbProfile.ancestralVillage || 'Not specified';

  // Format dates
  const formatDate = (date: Date | null): string => {
    if (!date) return new Date().toISOString();
    return date instanceof Date ? date.toISOString() : new Date(date).toISOString();
  };

  // Since your schema doesn't have lastActive, we'll use updatedAt or createdAt
  const formatLastActive = (date: Date | null): string => {
    if (!date) return 'Never';

    const now = new Date();
    const lastActiveDate = date instanceof Date ? date : new Date(date);
    const diffInHours = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Online now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;

    return lastActiveDate.toLocaleDateString();
  };

  return {
    id: dbProfile.id.toString(),
    name: dbProfile.name,
    userId: dbProfile.userId || 'Not specified',
    email: dbProfile.email || 'Not specified',
    age,
    dob: dbProfile.dob || 'Not specified', // Assuming dob is a string in ISO format
    height: dbProfile.height || 'Not specified',
    location,
    education: dbProfile.highestEducation || 'Not specified',
    occupation: dbProfile.occupation || 'Not specified',
    company: dbProfile.companyOrganization || 'Not specified',
    gotra: dbProfile.gotraDetails || 'Not specified',
    interests,
    // isPremium: false,
    // isVerified: false,
    isPremium: dbProfile.isPremium || false,
    isVerified: dbProfile.isVerified || false,
    lastActive: formatLastActive(dbProfile.updatedAt || dbProfile.createdAt),
    // profileImage: dbProfile.profileImage || "",
    profileImage1: dbProfile.profileImage1 || '',
    profileImage2: dbProfile.profileImage2 || '',
    profileImage3: dbProfile.profileImage3 || '',
    createdAt: formatDate(dbProfile.createdAt),
    updatedAt: formatDate(dbProfile.updatedAt),
    profileRelation: dbProfile.profileRelation || 'other',
    customRelation: dbProfile.customRelation || '',
    isActive: dbProfile.isActive ?? true,
    isDeleted: dbProfile.isDeleted ?? false
  };
}

// Helper function to extract interests from various fields
function extractInterests(dbProfile: DatabaseProfile): string[] {
  const interests: string[] = [];

  // Extract from hobbies
  if (dbProfile.hobbies) {
    const hobbies = dbProfile.hobbies
      .split(',')
      .map(h => h.trim())
      .filter(Boolean);
    interests.push(...hobbies);
  }

  // Extract from music preferences
  if (dbProfile.musicPreferences) {
    interests.push(`Music: ${dbProfile.musicPreferences}`);
  }

  // Extract from movie preferences
  if (dbProfile.moviePreferences) {
    interests.push(`Movies: ${dbProfile.moviePreferences}`);
  }

  // Extract from reading interests
  if (dbProfile.readingInterests) {
    interests.push(`Reading: ${dbProfile.readingInterests}`);
  }

  // Extract from travel interests
  if (dbProfile.travelInterests) {
    interests.push(`Travel: ${dbProfile.travelInterests}`);
  }

  // Extract from exercise
  if (dbProfile.exercise) {
    interests.push(`Fitness: ${dbProfile.exercise}`);
  }

  return interests.slice(0, 10); // Limit to 10 interests
}

export function transformDatabaseProfilesToProfiles(dbProfiles: DatabaseProfile[]): Profile[] {
  const transformed = dbProfiles
    .map(transformDatabaseProfileToProfile)
    .filter((profile): profile is Profile => profile !== null);

  console.log(`Transformed ${dbProfiles.length} database profiles to ${transformed.length} UI profiles`);
  return transformed;
}

function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
