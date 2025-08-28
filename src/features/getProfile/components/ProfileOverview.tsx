"use client";
import React, { useState } from "react";
import {
  User,
  GraduationCap,
  Users,
  TreePine,
  Home,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  Heart,
  Star,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  // Link,
  Pen,
  PenIcon,
  UserPen,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { LeftSideAddBanner } from "@/src/components/common/LeftSideAddBanner";

const ProfileOverview = (props: any) => {
  console.log(props?.profileData, "get profile by id");
  const profileData = props?.profileData;

  const calculateAge = (dob: any) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { id: "about", label: "About Him", icon: User },
    { id: "education", label: "Education & Career", icon: GraduationCap },
    { id: "family", label: "Family Details", icon: Users },
    { id: "heritage", label: "Heritage", icon: TreePine },
    { id: "lifestyle", label: "Lifestyle", icon: Home },
  ];
  {
    console.log(profileData);
  }

  return (
    <div
      className="flex min-h-screen bg-gradient-to-br from-orange-100 via-red-100 to-amber-100
 text-white p-6 relative"
    >
      {/* Left Sidebar */}
      <div className="hidden lg:block w-1/5 p-4">
        <div className=" top-10 left-10 text-orange-400">
          <Crown className="w-16 h-16" />
        </div>
        <div className="sticky top-4">
          <LeftSideAddBanner />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:w-3/5 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 shadow-lg rounded-lg overflow-hidden mt-8 mb-8 relative">
          {/* Background Crown Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
            <div className="absolute top-32 right-16 text-red-400">
              <Crown className="w-20 h-20" />
            </div>
            <div className="absolute top-80 left-20 text-amber-400">
              <Crown className="w-20 h-20" />
            </div>
            <div className="absolute bottom-40 right-8 text-orange-400">
              <Crown className="w-20 h-20" />
            </div>
            <div className="absolute bottom-20 left-32 text-red-400">
              <Crown className="w-20 h-20" />
            </div>
            <div className="absolute top-60 right-32 text-amber-400">
              <Crown className="w-20 h-20" />
            </div>
          </div>{" "}
          {/* Header Section */}
          <div
            className="bg-[linear-gradient(125deg,#ffc733,#a30000,#ff7426)]
 text-white p-6 relative"
          >
            {" "}
            {/* Added relative for positioning pencil icon */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden shadow-md">
                  {profileData.profileImage ? (
                    <img
                      src={profileData.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                </div>
              </div>
              {/* Basic Info */}
              <div className="flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {profileData.name}
                    </h1>
                    <div className="space-y-2 text-white">
                      <p className="text-lg">
                        {calculateAge(profileData.dob)}, {profileData.height}
                      </p>
                      <p className="font-medium capitalize">
                        {profileData.highestEducation}
                      </p>
                      <p className="capitalize">
                        {profileData.occupation.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Hindu</p>
                    <p>{profileData.languagesKnown}</p>
                    <p className="capitalize">
                      {profileData.maritalStatus.replace("-", " ")}
                    </p>
                    <p className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profileData.workLocation}
                    </p>
                  </div>
                </div>
                {/* Social Links */}
                <div className="flex gap-3 mt-4">
                  {profileData.facebook && (
                    <a href={profileData.facebook} className="text-white ">
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {profileData.instagram && (
                    <a href={profileData.instagram} className="text-white ">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {profileData.linkedin && (
                    <a href={profileData.linkedin} className="text-white">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {profileData.website && (
                    <a href={profileData.website} className="text-white">
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            {/* Pencil Icon for Edit */}
            <Link
              href={`/edit-profile/${profileData.userId}`}
              className="absolute cursor-pointer top-4 right-4 text-white hover:text-gray-700 transition-colors"
            >
              <span className="sr-only">Edit Profile</span>
              <UserPen className="w-8 h-8" />
            </Link>
          </div>
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-red-600 text-red-700 bg-red-50" // Updated active tab color
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          {/* Tab Content */}
          <div className="p-6 relative z-10 bg-white/80 backdrop-blur-sm">
            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    About Me
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {profileData.aboutMe}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Personal Details
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nick Name:</span>
                        <span className="font-medium">
                          {profileData?.nickName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date of Birth:</span>
                        <span className="font-medium">
                          {new Date(profileData.dob).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Height:</span>
                        <span className="font-medium">
                          {profileData.height}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weight:</span>
                        <span className="font-medium">
                          {profileData.weight} kg
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Complexion:</span>
                        <span className="font-medium capitalize">
                          {profileData.complexion}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Body Type:</span>
                        <span className="font-medium capitalize">
                          {profileData.bodyType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{profileData.phoneNo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{profileData.email}</span>
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 mt-4">
                      Interests
                    </h4>
                    <p className="text-sm text-gray-700">
                      {profileData.hobbies}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "education" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    Education
                  </h3>
                  <div className="bg-gray-50/90 backdrop-blur-sm p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                      <div>
                        <span className="text-gray-600 text-sm">
                          Highest Education:
                        </span>
                        <p className="font-medium capitalize">
                          {profileData.highestEducation}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">
                          College/University:
                        </span>
                        <p className="font-medium">
                          {profileData.collegeUniversity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    Career
                  </h3>
                  <div className="bg-gray-50/90 backdrop-blur-sm p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-600">
                      <div>
                        <span className="text-gray-600 text-sm">
                          Occupation:
                        </span>
                        <p className="font-medium capitalize">
                          {profileData.occupation.replace("-", " ")}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Company:</span>
                        <p className="font-medium">
                          {profileData.companyOrganization}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">
                          Designation:
                        </span>
                        <p className="font-medium">{profileData.designation}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">
                          Work Location:
                        </span>
                        <p className="font-medium">
                          {profileData.workLocation}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">
                          Annual Income:
                        </span>
                        <p className="font-medium">
                          {profileData.annualIncome}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Website:</span>
                        <a
                          href={profileData.website}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {profileData.website}
                        </a>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">
                        Work Experience:
                      </span>
                      <p className="text-gray-700 mt-1">
                        {profileData.workExperience}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "family" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    Family Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Father
                        </h4>
                        <p className="font-medium">{profileData.fatherName}</p>
                        <p className="text-gray-600 text-sm">
                          {profileData.fatherOccupation}
                        </p>
                      </div>
                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Mother
                        </h4>
                        <p className="font-medium">{profileData.motherName}</p>
                        <p className="text-gray-600 text-sm">
                          {profileData.motherOccupation}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Siblings
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Brothers:</span>
                            <span className="font-medium">
                              {profileData.brothers}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sisters:</span>
                            <span className="font-medium">
                              {profileData.sisters}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Family Income
                        </h4>
                        <p className="font-medium">
                          {profileData.familyIncome} (Annual)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "heritage" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    Genealogy & Heritage
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Gotra Details
                      </h4>
                      <p className="text-gray-700">
                        {profileData.gotraDetails}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Ancestral Village
                        </h4>
                        <p className="text-gray-700">
                          {profileData.ancestralVillage}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Family History
                        </h4>
                        <p className="text-gray-700">
                          {profileData.familyHistory}
                        </p>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Community Contributions
                      </h4>
                      <p className="text-gray-700">
                        {profileData.communityContributions}
                      </p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Family Traditions
                      </h4>
                      <p className="text-gray-700">
                        {profileData.familyTraditions}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "lifestyle" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    Lifestyle & Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Habits
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/70 backdrop-blur-sm rounded-lg">
                          <span className="text-gray-600">Diet:</span>
                          <span className="font-medium capitalize">
                            {profileData.diet}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Smoking:</span>
                          <span className="font-medium capitalize">
                            {profileData.smoking}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Drinking:</span>
                          <span className="font-medium capitalize">
                            {profileData.drinking}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Exercise:</span>
                          <span className="font-medium capitalize">
                            {profileData.exercise}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">
                            Religious Beliefs:
                          </span>
                          <span className="font-medium capitalize">
                            {profileData.religiousBeliefs.replace("-", " ")}
                          </span>
                        </div>
                        {/* <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">
                            Caste Preference:
                          </span>
                          <span className="font-medium capitalize">
                            {profileData.castPreferences.replace("-", " ")}
                          </span>
                        </div> */}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Interests
                      </h4>
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <span className="text-gray-600 text-sm">Music:</span>
                          <p className="font-medium">
                            {profileData.musicPreferences}
                          </p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <span className="text-gray-600 text-sm">Movies:</span>
                          <p className="font-medium">
                            {profileData.moviePreferences}
                          </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <span className="text-gray-600 text-sm">
                            Reading:
                          </span>
                          <p className="font-medium">
                            {profileData.readingInterests}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Travel Interests
                    </h4>
                    <p className="text-gray-700">
                      {profileData.travelInterests}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block w-1/5 p-4">
        <div className=" top-10 left-10 text-orange-400">
          <Crown className="w-16 h-16" />
        </div>
        <div className="sticky top-4">
          <LeftSideAddBanner />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
