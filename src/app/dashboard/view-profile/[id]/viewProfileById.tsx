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
  ChevronRight,
  ChevronLeft,
  Verified,
  HeartHandshakeIcon,
  Languages,
  Users2Icon,
  FlameKindlingIcon,
  BookCopyIcon,
} from "lucide-react";
import Link from "next/link";
import { LeftSideAddBanner } from "@/src/components/common/LeftSideAddBanner";

const ProfileImageCarousel = ({ profile }: { profile: any }) => {
  // Get all available images, prioritizing profileImage1 as primary
  const images = [
    profile.profileImage1,
    profile.profileImage2,
    profile.profileImage3,
  ].filter(Boolean); // Remove empty/null images

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setCurrentImageIndex(index);
  };

  return (
    <div className="relative w-60 h-72  bg-gradient-to-br from-orange-100 to-red-100 rounded-xl overflow-hidden group shadow-lg border-2 border-white bg-cover">
      {/* Main Image Display */}
      {images.length > 0 ? (
        <>
          <img
            src={images[currentImageIndex]}
            alt={`${profile.name}'s profile`}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100"><div class="text-orange-600 text-3xl lg:text-4xl font-bold">${getInitials(
                  profile.name
                )}</div></div>`;
              }
            }}
          />

          {/* Navigation Controls - Only show if more than 1 image */}
          {images.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Next Button */}
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => goToImage(index, e)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentImageIndex === index
                        ? "bg-white scale-110 shadow-lg"
                        : "bg-white/60 hover:bg-white/80 hover:scale-105"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Image Counter */}
              <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}

          {/* Primary Image Badge */}
          {currentImageIndex === 0 && images.length > 1 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium shadow-lg">
              Primary
            </div>
          )}
        </>
      ) : (
        // Fallback when no images available
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
          <div className="text-orange-600 text-3xl lg:text-4xl font-bold">
            {getInitials(profile.name)}
          </div>
        </div>
      )}

      {/* Profile Badges */}
      <div className="absolute -top-3 -right-3 flex flex-col gap-1">
        {profile.isPremium && (
          <div className="bg-white rounded-full p-1 shadow-lg">
            <Crown className="w-6 h-6 text-orange-500" />
          </div>
        )}
        {profile.isVerified && (
          <div className="bg-white rounded-full p-1 shadow-lg">
            <Verified className="w-6 h-6 text-green-500" />
          </div>
        )}
      </div>

      {/* Online Status Indicator */}
      {/* {profile.lastActive === "Online now" && (
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>
      )} */}
    </div>
  );
};

const ViewProfileById = (props: any) => {
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
  console.log(profileData, "profileData");

  return (
    <div className="flex min-h-screen  relative">
      {/* Left Sidebar */}
      {/* <div className="hidden lg:block w-1/5 p-4">
        <div className=" top-10 left-10 text-orange-400">
          <Crown className="w-16 h-16" />
        </div>
        <div className="sticky top-4">
          <LeftSideAddBanner />
        </div>
      </div> */}

      {/* Main Content */}
      <div className="flex-1  px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text drop-shadow-lg">
          Make sure to keep your profile 100% complete for better connections
        </h1>
        <div className=" mx-auto bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 shadow-lg rounded-lg overflow-hidden mt-8 mb-8 relative">
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
 text-white p-6 relative grid grid-cols-4 "
          >
            {" "}
            {/* Added relative for positioning pencil icon */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <ProfileImageCarousel profile={profileData} />
              </div>
            </div>
            {/* Basic Info */}
            <div className="capitalize text-lg">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2 white">
                    {profileData.name}
                  </h1>
                  <div className=" text-white">
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />{" "}
                      {calculateAge(profileData.dob)},{" "}
                      <User className="w-4 h-4" />
                      {profileData.height}
                    </p>
                    <p className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      {profileData.highestEducation}
                    </p>
                    <p className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {profileData.occupation}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="flex items-center gap-1">
                    <FlameKindlingIcon className="w-4 h-4" />
                    Hindu
                  </p>
                  <p className="flex items-center gap-1">
                    <Languages className="w-4 h-4" />
                    {profileData.languagesKnown}
                  </p>
                  <p className="capitalize flex items-center gap-1">
                    <HeartHandshakeIcon className="w-4 h-4" />
                    {profileData.maritalStatus}
                  </p>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profileData.workLocation}
                  </p>
                </div>
              </div>
              {/* Social Links */}
              {/* Social Links */}
              <div className="flex gap-3 mt-6">
                {profileData.facebook && (
                  <a
                    href={profileData.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
                {profileData.instagram && (
                  <a
                    href={profileData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
                {profileData.linkedin && (
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                )}
                {profileData.website && (
                  <a
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                  >
                    <Globe className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>
          {/* Pencil Icon for Edit */}
          <Link
            href={`/dashboard/edit-profile/${profileData.id}`}
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
        <div className="p-6 relative  bg-white/80 backdrop-blur-sm mb-10 border border-gray-200 shadow-lg">
          {activeTab === "about" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  About Me
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {profileData.aboutMe}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-96">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Personal Details
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 font-bold">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-bold">
                        Nick Name:
                      </span>
                      <span className="font-medium">
                        {profileData?.nickName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-bold">
                        Date of Birth:
                      </span>
                      <span className="font-medium">
                        {new Date(profileData.dob).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-bold">Height:</span>
                      <span className="font-medium">{profileData.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-bold">Weight:</span>
                      <span className="font-medium">
                        {profileData.weight} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-bold">
                        Complexion:
                      </span>
                      <span className="font-medium capitalize">
                        {profileData.complexion}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-bold">
                        Body Type:
                      </span>
                      <span className="font-medium capitalize">
                        {profileData.bodyType}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Contact Information
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 font-bold">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{profileData.phoneNo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{profileData.email}</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2 mt-4">
                    Interests
                  </h4>
                  <p className="text-sm text-gray-700">{profileData.hobbies}</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === "education" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  Education
                </h3>
                <div className="bg-gray-50/90 backdrop-blur-sm p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 font-bold">
                    <div>
                      <span className="text-gray-600 font-bold text-sm">
                        Highest Education:
                      </span>
                      <p className="font-medium capitalize">
                        {profileData.highestEducation}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-bold text-sm">
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
                <h3 className="text-lg font-bold mb-3 text-gray-900">Career</h3>
                <div className="bg-gray-50/90 backdrop-blur-sm p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-600 font-bold">
                    <div>
                      <span className="text-gray-600 font-bold text-sm">
                        Occupation:
                      </span>
                      <p className="font-medium capitalize">
                        {profileData.occupation}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-bold text-sm">
                        Company:
                      </span>
                      <p className="font-medium">
                        {profileData.companyOrganization}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-bold text-sm">
                        Designation:
                      </span>
                      <p className="font-medium">{profileData.designation}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-bold text-sm">
                        Work Location:
                      </span>
                      <p className="font-medium">{profileData.workLocation}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-bold text-sm">
                        Annual Income:
                      </span>
                      <p className="font-medium">{profileData.annualIncome}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-bold text-sm">
                        Website:
                      </span>
                      <a
                        href={profileData.website}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {profileData.website}
                      </a>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 font-bold text-sm">
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
                <h3 className="text-lg font-bold mb-4 text-gray-900">
                  Family Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600 font-bold">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Father</h4>
                      <p className="font-medium">{profileData.fatherName}</p>
                      <p className="text-gray-600 font-bold text-sm">
                        {profileData.fatherOccupation}
                      </p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Mother</h4>
                      <p className="font-medium">{profileData.motherName}</p>
                      <p className="text-gray-600 font-bold text-sm">
                        {profileData.motherOccupation}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-3">Siblings</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-bold">
                            Brothers:
                          </span>
                          <span className="font-medium">
                            {profileData.brothers}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-bold">
                            Sisters:
                          </span>
                          <span className="font-medium">
                            {profileData.sisters}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">
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
                <h3 className="text-lg font-bold mb-4 text-gray-900">
                  Genealogy & Heritage
                </h3>
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">
                      Gotra Details
                    </h4>
                    <p className="text-gray-700">{profileData.gotraDetails}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">
                        Ancestral Village
                      </h4>
                      <p className="text-gray-700">
                        {profileData.ancestralVillage}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">
                        Family History
                      </h4>
                      <p className="text-gray-700">
                        {profileData.familyHistory}
                      </p>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">
                      Community Contributions
                    </h4>
                    <p className="text-gray-700">
                      {profileData.communityContributions}
                    </p>
                  </div>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">
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
                <h3 className="text-lg font-bold mb-4 text-gray-900">
                  Lifestyle & Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600 font-bold">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Habits</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white/70 backdrop-blur-sm rounded-lg">
                        <span className="text-gray-600 font-bold">Diet:</span>
                        <span className="font-medium capitalize">
                          {profileData.diet}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-bold">
                          Smoking:
                        </span>
                        <span className="font-medium capitalize">
                          {profileData.smoking}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-bold">
                          Drinking:
                        </span>
                        <span className="font-medium capitalize">
                          {profileData.drinking}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-bold">
                          Exercise:
                        </span>
                        <span className="font-medium capitalize">
                          {profileData.exercise}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-bold">
                          Religious Beliefs:
                        </span>
                        <span className="font-medium capitalize">
                          {profileData.religiousBeliefs}
                        </span>
                      </div>
                      {/* <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 font-bold">
                          Caste Preference:
                        </span>
                        <span className="font-medium capitalize">
                          {profileData.castPreferences}
                        </span>
                      </div> */}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Interests</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-600 font-bold text-sm">
                          Music:
                        </span>
                        <p className="font-medium">
                          {profileData.musicPreferences}
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-600 font-bold text-sm">
                          Movies:
                        </span>
                        <p className="font-medium">
                          {profileData.moviePreferences}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <span className="text-gray-600 font-bold text-sm">
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
                  <h4 className="font-bold text-gray-900 mb-2">
                    Travel Interests
                  </h4>
                  <p className="text-gray-700">{profileData.travelInterests}</p>
                </div>
              </div>
            </div>
          )}
          {/* Sibling Details */}
          {activeTab === "family" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-900 mt-4">
                  Sibling Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600 font-bold">
                  {/* Brothers */}
                  <div className="space-y-3 bg-sky-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-3">Brothers</h4>
                    {profileData?.brothersDetails?.length > 0 ? (
                      profileData.brothersDetails.map(
                        (brother: any, index: number) => (
                          <div key={index} className="mb-4 border-b pb-2">
                            <p className="text-gray-700">
                              Name:{" "}
                              <span className="font-medium capitalize">
                                {brother.name}
                              </span>
                            </p>
                            <p className="text-gray-700">
                              Occupation:{" "}
                              <span className="font-medium capitalize">
                                {brother.occupation}
                              </span>
                            </p>
                            <p className="text-gray-700">
                              Marital Status:{" "}
                              <span className="font-medium capitalize">
                                {brother.maritalStatus}
                              </span>
                            </p>
                            {brother.maritalStatus === "married" && (
                              <>
                                <p className="text-gray-700">
                                  Spouse Name:{" "}
                                  <span className="font-medium capitalize">
                                    {brother.spouseName}
                                  </span>
                                </p>
                                <p className="text-gray-700">
                                  Spouse Occupation:{" "}
                                  <span className="font-medium capitalize">
                                    {brother.spouseOccupation}
                                  </span>
                                </p>
                              </>
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-gray-500">No brothers added</p>
                    )}
                  </div>

                  {/* Sisters */}
                  <div className="space-y-3 bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-3">Sisters</h4>
                    {profileData?.sistersDetails?.length > 0 ? (
                      profileData.sistersDetails.map(
                        (sister: any, index: number) => (
                          <div key={index} className="mb-4 border-b pb-2">
                            <p className="text-gray-700">
                              Name:{" "}
                              <span className="font-medium capitalize">
                                {sister.name}
                              </span>
                            </p>
                            <p className="text-gray-700">
                              Occupation:{" "}
                              <span className="font-medium capitalize">
                                {sister.occupation}
                              </span>
                            </p>
                            <p className="text-gray-700">
                              Marital Status:{" "}
                              <span className="font-medium capitalize">
                                {sister.maritalStatus}
                              </span>
                            </p>
                            {sister.maritalStatus === "married" && (
                              <>
                                <p className="text-gray-700">
                                  Spouse Name:{" "}
                                  <span className="font-medium capitalize">
                                    {sister.spouseName}
                                  </span>
                                </p>
                                <p className="text-gray-700">
                                  Spouse Occupation:{" "}
                                  <span className="font-medium capitalize">
                                    {sister.spouseOccupation}
                                  </span>
                                </p>
                              </>
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-gray-500">No sisters added</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfileById;
