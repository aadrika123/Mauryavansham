"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { PersonalInfoTab } from "@/src/features/createProfile/components/personal-info-tab"
import { FamilyDetailsTab } from "@/src/features/createProfile/components/family-details-tab"
import { EducationCareerTab } from "@/src/features/createProfile/components/education-career-tab"
import { LifestyleTab } from "@/src/features/createProfile/components/lifestyle-tab"
import { GenealogyTab } from "@/src/features/createProfile/components/genealogy-tab"
import { Card } from "@/src/components/ui/card"
import { ProfileSidebar } from "@/src/features/createProfile/components/profile-sidebar"

export type ProfileData = {
  personalInfo: {
    height: string
    weight: string
    complexion: string
    bodyType: string
    maritalStatus: string
    languagesKnown: string
    hobbies: string
    aboutMe: string
  }
  familyDetails: {
    fatherName: string
    fatherOccupation: string
    motherName: string
    motherOccupation: string
    brothers: string
    sisters: string
    marriedSiblings: string
    familyType: string
    familyValues: string
    familyIncome: string
    familyLocation: string
  }
  educationCareer: {
    highestEducation: string
    collegeUniversity: string
    occupation: string
    companyOrganization: string
    designation: string
    workLocation: string
    annualIncome: string
    workExperience: string
  }
  lifestyle: {
    diet: string
    smoking: string
    drinking: string
    exercise: string
    religiousBeliefs: string
    musicPreferences: string
    moviePreferences: string
    readingInterests: string
    travelInterests: string
  }
  genealogy: {
    gotraDetails: string
    ancestralVillage: string
    familyHistory: string
    communityContributions: string
    familyTraditions: string
    knownCommunityRelatives: string
    familyName: string
    familyTreeVisibility: string
  }
}

export default function CreateProfilePage() {
  const [activeTab, setActiveTab] = useState("personal-info")
  const [profileData, setProfileData] = useState<ProfileData>({
    personalInfo: {
      height: "",
      weight: "",
      complexion: "",
      bodyType: "",
      maritalStatus: "",
      languagesKnown: "",
      hobbies: "",
      aboutMe: "",
    },
    familyDetails: {
      fatherName: "",
      fatherOccupation: "",
      motherName: "",
      motherOccupation: "",
      brothers: "",
      sisters: "",
      marriedSiblings: "",
      familyType: "",
      familyValues: "",
      familyIncome: "",
      familyLocation: "",
    },
    educationCareer: {
      highestEducation: "",
      collegeUniversity: "",
      occupation: "",
      companyOrganization: "",
      designation: "",
      workLocation: "",
      annualIncome: "",
      workExperience: "",
    },
    lifestyle: {
      diet: "",
      smoking: "",
      drinking: "",
      exercise: "",
      religiousBeliefs: "",
      musicPreferences: "",
      moviePreferences: "",
      readingInterests: "",
      travelInterests: "",
    },
    genealogy: {
      gotraDetails: "",
      ancestralVillage: "",
      familyHistory: "",
      communityContributions: "",
      familyTraditions: "",
      knownCommunityRelatives: "",
      familyName: "",
      familyTreeVisibility: "",
    },
  })

  const updateProfileData = (section: keyof ProfileData, data: Partial<ProfileData[keyof ProfileData]>) => {
    setProfileData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }))
  }

  const handleSaveAsDraft = () => {
    console.log("Saving as draft:", profileData)
    // Implement save as draft logic
  }

  const handlePreviewProfile = () => {
    console.log("Preview profile:", profileData)
    // Implement preview logic
  }

  const handleCompleteProfile = () => {
    console.log("Complete profile:", profileData)
    // Implement complete profile logic
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "personal-info":
        return (
          <PersonalInfoTab
            data={profileData.personalInfo}
            onUpdate={(data) => updateProfileData("personalInfo", data)}
          />
        )
      case "family-details":
        return (
          <FamilyDetailsTab
            data={profileData.familyDetails}
            onUpdate={(data) => updateProfileData("familyDetails", data)}
          />
        )
      case "education-career":
        return (
          <EducationCareerTab
            data={profileData.educationCareer}
            onUpdate={(data) => updateProfileData("educationCareer", data)}
          />
        )
      case "lifestyle":
        return <LifestyleTab data={profileData.lifestyle} onUpdate={(data) => updateProfileData("lifestyle", data)} />
      case "genealogy":
        return <GenealogyTab data={profileData.genealogy} onUpdate={(data) => updateProfileData("genealogy", data)} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-6">{renderActiveTab()}</Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <Button variant="outline" onClick={handleSaveAsDraft} className="w-full sm:w-auto bg-transparent">
                Save as Draft
              </Button>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="outline" onClick={handlePreviewProfile} className="w-full sm:w-auto bg-transparent">
                  Preview Profile
                </Button>
                <Button onClick={handleCompleteProfile} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
                  Complete Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
