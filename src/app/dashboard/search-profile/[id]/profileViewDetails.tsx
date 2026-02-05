'use client';

import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/src/components/ui/separator';
import {
  Heart,
  MessageCircle,
  ArrowLeft,
  MapPin,
  GraduationCap,
  Briefcase,
  Users,
  Calendar,
  Crown,
  CheckCircle,
  Utensils,
  Dumbbell,
  Music,
  Film,
  Book,
  Plane,
  Verified,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import type { DetailedProfile, Profile } from '@/src/features/searchProfile/type';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Loader from '@/src/components/ui/loader';
import { escapeHtml } from '@/src/lib/utils';

interface ProfileDetailViewProps {
  profile: DetailedProfile;
}
interface ProfilesListProps {
  profiles: Profile[];
  totalCount: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}
export default function ProfileDetailView({ profile }: ProfileDetailViewProps) {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  const { data: session } = useSession();
  const [expressed, setExpressed] = useState<Record<string, boolean>>({});
  const [showProfileSelectModal, setShowProfileSelectModal] = useState(false);
  const [userProfiles, setUserProfiles] = useState<Profile[]>([]);
  const [pendingReceiverProfile, setPendingReceiverProfile] = useState<string | null>(null);
  const [pendingReceiverUser, setPendingReceiverUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const ProfileImageCarousel = ({ profile }: { profile: any }) => {
    // Get all available images, prioritizing profileImage1 as primary
    const images = [profile.profileImage1, profile.profileImage2, profile.profileImage3].filter(Boolean); // Remove empty/null images

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const getInitials = (name: string): string => {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    const goToPrevious = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click
      setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click
      setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const goToImage = (index: number, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click
      setCurrentImageIndex(index);
    };

    return (
      <div className="relative w-56 h-72 mx-auto bg-gradient-to-br from-orange-100 to-red-100 rounded-xl overflow-hidden group shadow-lg border-2 border-white flex items-center justify-center">
        {/* Main Image Display */}
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={`${profile.name}'s profile`}
              className="max-w-full max-h-full object-contain transition-all duration-500 group-hover:scale-105"
              onError={e => {
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
                      onClick={e => goToImage(index, e)}
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
            <div className="text-orange-600 text-3xl lg:text-4xl font-bold">{getInitials(profile.name)}</div>
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
        {profile.lastActive === 'Online now' && (
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>
        )}
      </div>
    );
  };
  const handleExpressInterest = async (receiverProfileId: string, receiverUserId: string) => {
    setPendingReceiverProfile(receiverProfileId);
    setPendingReceiverUser(receiverUserId);

    // fetch logged-in user's profiles from API
    if (!userProfiles.length && session?.user?.id) {
      setLoading(true);
      try {
        const res = await fetch(`/api/allProfiles/${session.user.id}`);
        const data = await res.json();
        if (data.success) {
          setUserProfiles(data.data);
        } else {
          console.error('Failed to fetch user profiles:', data.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    setShowProfileSelectModal(true); // open popup
  };

  const sendInterest = async (profileId: string) => {
    if (!pendingReceiverProfile || !pendingReceiverUser) return;

    setLoading(true); // show loader for POST request
    try {
      const res = await fetch(`/api/profile-interest/${pendingReceiverProfile}/interests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderUserId: session?.user?.id, // correct field name
          senderProfileId: profileId, // profile id of sender
          receiverUserId: pendingReceiverUser, // correct field name
          senderProfile: {
            name: session?.user?.name,
            email: session?.user?.email,
            phone: (session?.user as any)?.phone,
            city: (session?.user as any)?.city,
            dob: (session?.user as any)?.dob,
            address: (session?.user as any)?.address,
            fatherName: (session?.user as any)?.fatherName,
            state: (session?.user as any)?.state
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setExpressed(prev => ({
          ...prev,
          [pendingReceiverProfile]: true
        }));
      } else {
        alert(data.message || 'Failed to express interest');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // hide loader
      setShowProfileSelectModal(false);
      setPendingReceiverProfile(null);
      setPendingReceiverUser(null);
    }
  };

  const handleSendMessage = () => {
    console.log('Send message:', profile.id);
  };
  console.log(profile, 'profileviewdetails');
  return (
    <div className="min-h-screen bg-orange-50 relative overflow-hidden">
      {/* Decorative Crown Icons */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
          <Loader />
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Crown className="absolute top-10 left-10 w-16 h-16 text-red-400 opacity-10 rotate-12" />
        <Crown className="absolute top-40 right-20 w-20 h-20 text-red-400 opacity-10 -rotate-12" />
        <Crown className="absolute bottom-20 left-1/4 w-24 h-24 text-red-400 opacity-10 rotate-6" />
        <Crown className="absolute bottom-10 right-10 w-16 h-16 text-red-400 opacity-10 -rotate-6" />
        <Crown className="absolute top-1/3 left-1/3 w-20 h-20 text-red-400 opacity-10 rotate-45" />
      </div>

      {/* Main Content */}
      <div className="relative ">
        {/* Breadcrumb Navigation */}

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Summary */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <div className="relative mx-auto">
                    <div className="flex-shrink-0">
                      <ProfileImageCarousel profile={profile} />
                    </div>
                    <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                      {profile.isPremium && (
                        <Badge className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1">
                          <Crown className="w-3 h-3 mr-1" />
                          {/* Premium */}
                        </Badge>
                      )}
                      {profile.isVerified && (
                        <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {/* Verified */}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                    {profile.nickName && <p className="text-gray-600">"{profile.nickName}"</p>}
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-2">
                      <span>{profile.age} years</span>
                      <span>•</span>
                      <span>{profile.height}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{profile.location}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Last seen {profile.lastActive}</p>
                  </div>
                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={expressed[profile.id]}
                      onClick={() => handleExpressInterest(profile.id, profile.userId)}
                      className="flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      {expressed[profile.id] ? 'Interest Sent' : 'Express Interest'}
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Quick Info */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <span>{profile.education}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span>
                      {profile.occupation} at {profile.company}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>Gotra: {profile.gotra}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>Born: {new Date(profile.dob).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Me */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About Me</h2>
                <p className="text-gray-700 leading-relaxed">{profile.aboutMe}</p>
              </Card>

              {/* Interests */}
              {profile.interests.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Interests & Hobbies</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Professional Details */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Occupation</label>
                    <p className="text-gray-900">{profile.occupation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Company</label>
                    <p className="text-gray-900">{profile.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Designation</label>
                    <p className="text-gray-900">{profile.designation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Work Location</label>
                    <p className="text-gray-900">{profile.workLocation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Annual Income</label>
                    <p className="text-gray-900">{profile.income} Lakhs</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Work Experience</label>
                    <p className="text-gray-900">{profile.workExperience}</p>
                  </div>
                </div>
              </Card>

              {/* Personal Details */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Height & Weight</label>
                    <p className="text-gray-900">
                      {profile.height}, {profile.weight} kg
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Complexion</label>
                    <p className="text-gray-900 capitalize">{profile.personalDetails.complexion}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Body Type</label>
                    <p className="text-gray-900 capitalize">{profile.personalDetails.bodyType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Marital Status</label>
                    <p className="text-gray-900 capitalize">
                      {profile.personalDetails.maritalStatus.replace('-', ' ')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Languages Known</label>
                    <p className="text-gray-900">{profile.personalDetails.languagesKnown.join(', ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Religious Beliefs</label>
                    <p className="text-gray-900 capitalize">
                      {profile.personalDetails.religiousBeliefs.replace('-', ' ')}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-600">Diet</p>
                      <p className="text-sm font-medium capitalize">{profile.personalDetails.diet.replace('-', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 text-gray-500">🚬</div>
                    <div>
                      <p className="text-xs text-gray-600">Smoking</p>
                      <p className="text-sm font-medium capitalize">{profile.personalDetails.smoking}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 text-gray-500">🍷</div>
                    <div>
                      <p className="text-xs text-gray-600">Drinking</p>
                      <p className="text-sm font-medium capitalize">{profile.personalDetails.drinking}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-600">Exercise</p>
                      <p className="text-sm font-medium capitalize">{profile.personalDetails.exercise}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Family Details */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Family Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Father</label>
                    <p className="text-gray-900">{profile.familyDetails.fatherName}</p>
                    <p className="text-sm text-gray-600">{profile.familyDetails.fatherOccupation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Mother</label>
                    <p className="text-gray-900">{profile.familyDetails.motherName}</p>
                    <p className="text-sm text-gray-600">{profile.familyDetails.motherOccupation}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Siblings</label>
                    <p className="text-gray-900">
                      {profile.familyDetails.brothers} Brothers, {profile.familyDetails.sisters} Sisters
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Family Income</label>
                    <p className="text-gray-900">{profile.familyDetails.familyIncome} Lakhs</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ancestral Village</label>
                    <p className="text-gray-900">{profile.familyDetails.ancestralVillage}</p>
                  </div>
                </div>

                {profile.familyDetails.familyHistory !== 'Not specified' && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <label className="text-sm font-medium text-gray-600">Family History</label>
                      <p className="text-gray-700 mt-1">{profile.familyDetails.familyHistory}</p>
                    </div>
                  </>
                )}

                {profile.familyDetails.familyTraditions !== 'Not specified' && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600">Family Traditions</label>
                    <p className="text-gray-700 mt-1">{profile.familyDetails.familyTraditions}</p>
                  </div>
                )}

                {profile.familyDetails.communityContributions !== 'Not specified' && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-600">Community Contributions</label>
                    <p className="text-gray-700 mt-1">{profile.familyDetails.communityContributions}</p>
                  </div>
                )}
                {/* Siblings Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 mt-4">Sibling Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600 font-bold">
                    {/* Brothers */}
                    <div className="space-y-3 bg-sky-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-3">Brothers</h4>
                      {Array.isArray(profile?.familyDetails?.brothersDetails) &&
                      profile.familyDetails.brothersDetails.length > 0 ? (
                        profile.familyDetails.brothersDetails.map((brother: any, index: number) => (
                          <div key={index} className="mb-4 border-b pb-2">
                            <p className="text-gray-700">
                              Name: <span className="font-medium capitalize">{brother.name}</span>
                            </p>
                            <p className="text-gray-700">
                              Occupation: <span className="font-medium capitalize">{brother.occupation}</span>
                            </p>
                            <p className="text-gray-700">
                              Marital Status: <span className="font-medium capitalize">{brother.maritalStatus}</span>
                            </p>
                            {brother.maritalStatus === 'married' && (
                              <>
                                <p className="text-gray-700">
                                  Spouse Name: <span className="font-medium capitalize">{brother.spouseName}</span>
                                </p>
                                <p className="text-gray-700">
                                  Spouse Occupation:{' '}
                                  <span className="font-medium capitalize">{brother.spouseOccupation}</span>
                                </p>
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No brothers added</p>
                      )}
                    </div>

                    {/* Sisters */}
                    {Array.isArray(profile?.familyDetails?.sistersDetails) &&
                    profile.familyDetails.sistersDetails.length > 0 ? (
                      profile.familyDetails.sistersDetails.map((sister: any, index: number) => (
                        <div key={index} className="mb-4 border-b pb-2">
                          <p className="text-gray-700">
                            Name: <span className="font-medium capitalize">{sister.name}</span>
                          </p>
                          <p className="text-gray-700">
                            Occupation: <span className="font-medium capitalize">{sister.occupation}</span>
                          </p>
                          <p className="text-gray-700">
                            Marital Status: <span className="font-medium capitalize">{sister.maritalStatus}</span>
                          </p>
                          {sister.maritalStatus === 'married' && (
                            <>
                              <p className="text-gray-700">
                                Spouse Name: <span className="font-medium capitalize">{sister.spouseName}</span>
                              </p>
                              <p className="text-gray-700">
                                Spouse Occupation:{' '}
                                <span className="font-medium capitalize">{sister.spouseOccupation}</span>
                              </p>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No sisters added</p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Preferences */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Preferences & Interests</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Music className="w-5 h-5 text-orange-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Music</h4>
                      <p className="text-gray-600 text-sm">{profile.preferences.musicPreferences}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Film className="w-5 h-5 text-orange-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Movies</h4>
                      <p className="text-gray-600 text-sm">{profile.preferences.moviePreferences}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Book className="w-5 h-5 text-orange-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Reading</h4>
                      <p className="text-gray-600 text-sm">{profile.preferences.readingInterests}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Plane className="w-5 h-5 text-orange-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Travel</h4>
                      <p className="text-gray-600 text-sm">{profile.preferences.travelInterests}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <label className="text-sm font-medium text-gray-600">Partner Preferences</label>
                  <p className="text-gray-700 mt-1 capitalize">
                    {profile.preferences.castPreferences.replace('-', ' ')}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {showProfileSelectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-80 max-h-[80vh] overflow-y-auto space-y-4">
            <h2 className="text-lg font-semibold text-red-900">Select Your Profile</h2>
            <div className="space-y-2">
              {userProfiles.length === 0 ? (
                <p className="text-gray-500 text-sm">Create at least one profile to express interest</p>
              ) : (
                userProfiles.map(profile => (
                  <div
                    key={profile.id}
                    className="p-2 border rounded hover:bg-red-50 cursor-pointer"
                    onClick={() => sendInterest(profile.id)}
                  >
                    {profile.name} ({profile.profileRelation})
                  </div>
                ))
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full"
              onClick={() => {
                setShowProfileSelectModal(false);
                window.location.reload(); // ✅ reload page
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
