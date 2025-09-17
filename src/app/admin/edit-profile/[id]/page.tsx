// import CreateProfilePage, { FlatProfileData, ProfileData } from "@/src/app/(home)/create-profile/page";
import { getProfileById } from "@/src/features/getProfile/actions/getProfileById";
// import CreateProfilePage, { FlatProfileData, ProfileData } from "../../create-profile/page";
import { Crown } from "lucide-react";
import EditProfileForm, { FlatProfileData, ProfileData } from "./editProfileForm";
import DashboardLayout from "@/src/components/layout/dashboardLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import CreateProfileForm from "../../create-profile/createProfileForm";
import AdmindashboardLayout from "@/src/components/layout/adminDashboardLayout";
const transformFlatToNested = (flatData: FlatProfileData): ProfileData => {
  return {
    id: flatData.id,
    userId: flatData.userId,
    profileRelation: flatData.profileRelation,
    customRelation: flatData.customRelation,
    personalInfo: {
      name: flatData.name || "",
      nickName: flatData.nickName || "",
      phoneNo: flatData.phoneNo || "",
      email: flatData.email || "",
      dob: flatData.dob || "",
      gender: flatData.gender || "",
      height: flatData.height || "",
      weight: flatData.weight || "",
      complexion: flatData.complexion || "",
      bodyType: flatData.bodyType || "",
      maritalStatus: flatData.maritalStatus || "",
      languagesKnown: flatData.languagesKnown || "",
      hobbies: flatData.hobbies || "",
      aboutMe: flatData.aboutMe || "",
      // profileImage: flatData.profileImage || "",
      profileImage1: flatData.profileImage1 || "",
      profileImage2: flatData.profileImage2 || "",
      profileImage3: flatData.profileImage3 || "",
      facebook: flatData.facebook || "",
      instagram: flatData.instagram || "",
      linkedin: flatData.linkedin || "",
    },
    familyDetails: {
      fatherName: flatData.fatherName || "",
      fatherOccupation: flatData.fatherOccupation || "",
      motherName: flatData.motherName || "",
      motherOccupation: flatData.motherOccupation || "",
      brothers: flatData.brothers || "",
      sisters: flatData.sisters || "",
      marriedSiblings: flatData.marriedSiblings || "",
      familyType: flatData.familyType || "",
      familyValues: flatData.familyValues || "",
      familyIncome: flatData.familyIncome || "",
      familyLocation: flatData.familyLocation || "",
      brothersDetails: flatData.brothersDetails || [],
      sistersDetails: flatData.sistersDetails || [],
    },
    educationCareer: {
      highestEducation: flatData.highestEducation || "",
      collegeUniversity: flatData.collegeUniversity || "",
      occupation: flatData.occupation || "",
      companyOrganization: flatData.companyOrganization || "",
      designation: flatData.designation || "",
      workLocation: flatData.workLocation || "",
      annualIncome: flatData.annualIncome || "",
      workExperience: flatData.workExperience || "",
      website: flatData.website || "",
    },
    lifestyle: {
      diet: flatData.diet || "",
      smoking: flatData.smoking || "",
      drinking: flatData.drinking || "",
      exercise: flatData.exercise || "",
      religiousBeliefs: flatData.religiousBeliefs || "",
      musicPreferences: flatData.musicPreferences || "",
      moviePreferences: flatData.moviePreferences || "",
      readingInterests: flatData.readingInterests || "",
      travelInterests: flatData.travelInterests || "",
      castPreferences: flatData.castPreferences || "",
    },
    genealogy: {
      gotraDetails: flatData.gotraDetails || "",
      ancestralVillage: flatData.ancestralVillage || "",
      familyHistory: flatData.familyHistory || "",
      communityContributions: flatData.communityContributions || "",
      familyTraditions: flatData.familyTraditions || "",
    },
  };
};

export default async function EditProfilePage({ params }: { params: { id: string } }) {
  // Await the params to resolve before using it
  const { id } = params;

  const result = await getProfileById(id);

  console.log(result, "geteditprofilebyuser");

  if (!result.success || !result.data) {
    return <div className="text-red-500">Profile not found</div>;
  }
   const session = await getServerSession(authOptions);
  
    // 2. Agar session nahi mila to sign-in page par bhejo
    if (!session?.user?.id) {
      redirect("/sign-in");
    }

  // Transform the flat data from getProfileById into the nested ProfileData structure
  // const nestedProfileData: ProfileData = transformFlatToNested(result?.data as FlatProfileData);

  const nestedProfileData = transformFlatToNested(result?.data as any);

  return (
    <AdmindashboardLayout user={session.user}>
    <div className="max-w-full mx-auto  bg-orange-50 ">
      {/* <h1 className="text-3xl font-semibold mb-4 text-center text-red-700 ml-40">
        <Crown className="inline-block mr-2 w-8 h-10" />
        Edit Profile
      </h1> */}
      <EditProfileForm profile={nestedProfileData} type="edit" />
    </div>
    </AdmindashboardLayout>
  );
}
