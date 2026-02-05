import {
  FlatProfileData,
  ProfileData
} from '@/src/app/dashboard/edit-profile/[id]/editProfileForm';
import { getProfileById } from '@/src/features/getProfile/actions/getProfileById';
import { Crown } from 'lucide-react';
import CreateProfileForm from '@/src/app/dashboard/create-profile/createProfileForm';
const transformFlatToNested = (flatData: FlatProfileData): ProfileData => {
  return {
    id: flatData.id,
    userId: flatData.userId,
    profileRelation: flatData.profileRelation,
    customRelation: flatData.customRelation,
    personalInfo: {
      name: flatData.name || '',
      nickName: flatData.nickName || '',
      phoneNo: flatData.phoneNo || '',
      email: flatData.email || '',
      dob: flatData.dob || '',
      gender: flatData.gender || '',
      height: flatData.height || '',
      weight: flatData.weight || '',
      complexion: flatData.complexion || '',
      bodyType: flatData.bodyType || '',
      maritalStatus: flatData.maritalStatus || '',
      languagesKnown: flatData.languagesKnown || '',
      hobbies: flatData.hobbies || '',
      aboutMe: flatData.aboutMe || '',
      // profileImage: flatData.profileImage || "",
      profileImage1: flatData.profileImage1 || '',
      profileImage2: flatData.profileImage2 || '',
      profileImage3: flatData.profileImage3 || '',
      facebook: flatData.facebook || '',
      instagram: flatData.instagram || '',
      linkedin: flatData.linkedin || ''
    },
    familyDetails: {
      fatherName: flatData.fatherName || '',
      fatherOccupation: flatData.fatherOccupation || '',
      motherName: flatData.motherName || '',
      motherOccupation: flatData.motherOccupation || '',
      brothers: flatData.brothers || '',
      sisters: flatData.sisters || '',
      marriedSiblings: flatData.marriedSiblings || '',
      familyType: flatData.familyType || '',
      familyValues: flatData.familyValues || '',
      familyIncome: flatData.familyIncome || '',
      familyLocation: flatData.familyLocation || '',
      brothersDetails: flatData.brothersDetails || [],
      sistersDetails: flatData.sistersDetails || []
    },
    educationCareer: {
      highestEducation: flatData.highestEducation || '',
      collegeUniversity: flatData.collegeUniversity || '',
      occupation: flatData.occupation || '',
      companyOrganization: flatData.companyOrganization || '',
      designation: flatData.designation || '',
      workLocation: flatData.workLocation || '',
      annualIncome: flatData.annualIncome || '',
      workExperience: flatData.workExperience || '',
      website: flatData.website || ''
    },
    lifestyle: {
      diet: flatData.diet || '',
      smoking: flatData.smoking || '',
      drinking: flatData.drinking || '',
      exercise: flatData.exercise || '',
      religiousBeliefs: flatData.religiousBeliefs || '',
      musicPreferences: flatData.musicPreferences || '',
      moviePreferences: flatData.moviePreferences || '',
      readingInterests: flatData.readingInterests || '',
      travelInterests: flatData.travelInterests || '',
      castPreferences: flatData.castPreferences || ''
    },
    genealogy: {
      gotraDetails: flatData.gotraDetails || '',
      ancestralVillage: flatData.ancestralVillage || '',
      familyHistory: flatData.familyHistory || '',
      communityContributions: flatData.communityContributions || '',
      familyTraditions: flatData.familyTraditions || ''
    }
  };
};

export default async function EditProfilePage({
  params
}: {
  params: Promise<{ userId: string }>;
}) {
  // Await the params to resolve before using it
  const { userId } = await params;

  const result = await getProfileById(userId);

  console.log(result, 'geteditprofilebyuser');

  if (!result.success || !result.data) {
    return <div className="text-red-500">Profile not found</div>;
  }

  // Transform the flat data from getProfileById into the nested ProfileData structure
  const nestedProfileData: ProfileData = transformFlatToNested(
    result?.data as any
  );

  return (
    <div className="max-w-full mx-auto  bg-orange-50 px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4 text-center text-red-700 ml-40">
        <Crown className="inline-block mr-2 w-8 h-10" />
        Edit Profile
      </h1>
      <CreateProfileForm profile={nestedProfileData} type="edit" />
    </div>
  );
}
