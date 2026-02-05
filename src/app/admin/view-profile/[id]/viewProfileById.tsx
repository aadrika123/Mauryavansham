'use client';
import React, { useState } from 'react';
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
  BookCopyIcon
} from 'lucide-react';
import Link from 'next/link';
import { LeftSideAddBanner } from '@/src/components/common/LeftSideAddBanner';
import { escapeHtml } from '@/src/lib/utils';

const ProfileImageCarousel = ({ profile }: { profile: any }) => {
  // Get all available images, prioritizing profileImage1 as primary
  const images = [
    profile.profileImage1,
    profile.profileImage2,
    profile.profileImage3
  ].filter(Boolean); // Remove empty/null images

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
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
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100"><div class="text-orange-600 text-3xl lg:text-4xl font-bold">${escapeHtml(
                  getInitials(profile.name)
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
                        ? 'bg-white scale-110 shadow-lg'
                        : 'bg-white/60 hover:bg-white/80 hover:scale-105'
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
  console.log(props?.profileData, 'get profile by id');
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

  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'About Him', icon: User },
    { id: 'education', label: 'Education & Career', icon: GraduationCap },
    { id: 'family', label: 'Family Details', icon: Users },
    { id: 'heritage', label: 'Heritage', icon: TreePine },
    { id: 'lifestyle', label: 'Lifestyle', icon: Home }
  ];
  console.log(profileData, 'profileData');

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
      <div className="flex-1 px-2 sm:px-4">
        {/* Header Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text drop-shadow-lg px-2">
          Make sure to keep your profile 100% complete for better connections
        </h1>

        <div className="mx-auto bg-gradient-to-br from-orange-50 via-red-50 to-amber-50 shadow-lg rounded-lg overflow-hidden mt-6 sm:mt-8 mb-6 sm:mb-8 relative">
          {/* Background Crown Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
            <div className="absolute top-32 right-4 sm:right-16 text-red-400">
              <Crown className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div className="absolute top-80 left-6 sm:left-20 text-amber-400">
              <Crown className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div className="absolute bottom-40 right-4 sm:right-8 text-orange-400">
              <Crown className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div className="absolute bottom-20 left-10 sm:left-32 text-red-400">
              <Crown className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <div className="absolute top-60 right-12 sm:right-32 text-amber-400">
              <Crown className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
          </div>

          {/* Header Section */}
          <div className="bg-[linear-gradient(125deg,#ffc733,#a30000,#ff7426)] text-white p-4 sm:p-6 relative grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Profile Image */}
            <div className="flex justify-center md:justify-start">
              <ProfileImageCarousel profile={profileData} />
            </div>

            {/* Basic Info */}
            <div className="capitalize text-base sm:text-lg md:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {profileData.name}
                  </h1>
                  <div className="text-white space-y-1">
                    <p className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {calculateAge(profileData.dob)},{' '}
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
                <div className="space-y-1">
                  <p className="flex items-center gap-1">
                    <FlameKindlingIcon className="w-4 h-4" /> Hindu
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
              <div className="flex gap-3 mt-4 sm:mt-6 flex-wrap">
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
            href={`/admin/edit-profile/${profileData.id}`}
            className="absolute cursor-pointer top-3 sm:top-4 right-3 sm:right-4 text-white hover:text-gray-700 transition-colors"
          >
            <span className="sr-only">Edit Profile</span>
            <UserPen className="w-6 h-6 sm:w-8 sm:h-8" />
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-600 text-red-700 bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 relative bg-white/80 backdrop-blur-sm mb-8 border border-gray-200 shadow-lg">
          {/* Yahan pe aapke saare activeTab content blocks rahenge (About, Education, Family, Heritage, Lifestyle etc.) 
        Maine unko change nahi kiya hai — sirf wrapper responsive banaya hai. */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  About Me
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {profileData.aboutMe}
                </p>
              </div>

              {/* Personal + Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Details */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Personal Details
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 font-bold">
                    <div className="flex justify-between">
                      <span>Nick Name:</span>
                      <span className="font-medium">
                        {profileData?.nickName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date of Birth:</span>
                      <span className="font-medium">
                        {new Date(profileData.dob).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Height:</span>
                      <span className="font-medium">{profileData.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weight:</span>
                      <span className="font-medium">
                        {profileData.weight} kg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Complexion:</span>
                      <span className="font-medium capitalize">
                        {profileData.complexion}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Body Type:</span>
                      <span className="font-medium capitalize">
                        {profileData.bodyType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
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
        </div>
      </div>
    </div>
  );
};

export default ViewProfileById;
