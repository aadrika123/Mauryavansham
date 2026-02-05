import type { DatabaseProfile, DetailedProfile } from '../type';

export function transformToDetailedProfile(dbProfile: DatabaseProfile): DetailedProfile | null {
  if (!dbProfile.name) return null;

  // Calculate age from DOB
  const calculateAge = (dob: string | null): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Parse languages
  const parseLanguages = (languages: string | null): string[] => {
    if (!languages) return [];
    return languages
      .split(',')
      .map(lang => lang.trim())
      .filter(Boolean);
  };

  // Extract interests
  const extractInterests = (): string[] => {
    const interests: string[] = [];
    if (dbProfile.hobbies)
      interests.push(
        ...dbProfile.hobbies
          .split(',')
          .map(h => h.trim())
          .filter(Boolean)
      );
    if (dbProfile.musicPreferences) interests.push(`Music: ${dbProfile.musicPreferences}`);
    if (dbProfile.moviePreferences) interests.push(`Movies: ${dbProfile.moviePreferences}`);
    if (dbProfile.readingInterests) interests.push(`Reading: ${dbProfile.readingInterests}`);
    if (dbProfile.travelInterests) interests.push(`Travel: ${dbProfile.travelInterests}`);
    return interests;
  };

  // Format last active
  const formatLastActive = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Online now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
  };

  return {
    id: dbProfile.id.toString(),
    name: dbProfile.name,
    email: dbProfile.email || '',
    userId: dbProfile.userId || '',
    nickName: dbProfile.nickName || undefined,
    age: calculateAge(dbProfile.dob),
    dob: dbProfile.dob || '',
    height: dbProfile.height || 'Not specified',
    weight: dbProfile.weight || 'Not specified',
    location: dbProfile.workLocation || 'Not specified',
    education: dbProfile.highestEducation || 'Not specified',
    occupation: dbProfile.occupation || 'Not specified',
    company: dbProfile.companyOrganization || 'Not specified',
    designation: dbProfile.designation || 'Not specified',
    workLocation: dbProfile.workLocation || 'Not specified',
    income: dbProfile.annualIncome || 'Not specified',
    workExperience: dbProfile.workExperience || 'Not specified',
    gotra: dbProfile.gotraDetails || 'Not specified',
    profileRelation: dbProfile.profileRelation || 'other',
    customRelation: dbProfile.customRelation || '',
    interests: extractInterests(),
    // isPremium: dbProfile.isPremium,
    // isVerified: dbProfile.isVerified,
    isPremium: dbProfile.isPremium || false,
    isVerified: dbProfile.isVerified || false,
    isActive: dbProfile.isActive || false,
    profileImage: dbProfile.profileImage || '',
    profileImage1: dbProfile.profileImage1 || '',
    profileImage2: dbProfile.profileImage2 || '',
    profileImage3: dbProfile.profileImage3 || '',
    personalDetails: {
      complexion: dbProfile.complexion || 'Not specified',
      bodyType: dbProfile.bodyType || 'Not specified',
      maritalStatus: dbProfile.maritalStatus || 'Not specified',
      languagesKnown: parseLanguages(dbProfile.languagesKnown),
      diet: dbProfile.diet || 'Not specified',
      smoking: dbProfile.smoking || 'Not specified',
      drinking: dbProfile.drinking || 'Not specified',
      exercise: dbProfile.exercise || 'Not specified',
      religiousBeliefs: dbProfile.religiousBeliefs || 'Not specified'
    },
    familyDetails: {
      fatherName: dbProfile.fatherName || 'Not specified',
      fatherOccupation: dbProfile.fatherOccupation || 'Not specified',
      motherName: dbProfile.motherName || 'Not specified',
      motherOccupation: dbProfile.motherOccupation || 'Not specified',
      brothers: dbProfile.brothers || '0',
      sisters: dbProfile.sisters || '0',
      familyIncome: dbProfile.familyIncome || 'Not specified',
      ancestralVillage: dbProfile.ancestralVillage || 'Not specified',
      familyHistory: dbProfile.familyHistory || 'Not specified',
      communityContributions: dbProfile.communityContributions || 'Not specified',
      familyTraditions: dbProfile.familyTraditions || 'Not specified',
      brothersDetails: dbProfile.brothersDetails || 'Not specified',
      sistersDetails: dbProfile.sistersDetails || 'Not specified'
    },
    preferences: {
      musicPreferences: dbProfile.musicPreferences || 'Not specified',
      moviePreferences: dbProfile.moviePreferences || 'Not specified',
      readingInterests: dbProfile.readingInterests || 'Not specified',
      travelInterests: dbProfile.travelInterests || 'Not specified',
      castPreferences: dbProfile.castPreferences || 'Not specified'
    },
    aboutMe: dbProfile.aboutMe || 'No description provided',
    // lastActive: formatLastActive(dbProfile.updatedAt),
    lastActive: formatLastActive((dbProfile.updatedAt as any) || dbProfile.createdAt),
    createdAt: dbProfile.createdAt ? dbProfile.createdAt.toISOString() : '',
    updatedAt: dbProfile.updatedAt ? dbProfile.updatedAt.toISOString() : ''
    // createdAt: dbProfile.createdAt.toISOString(),
    // updatedAt: dbProfile.updatedAt.toISOString(),
  };
}
