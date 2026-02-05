'use client';

import { Card } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select';
import {
  Heart,
  MessageCircle,
  Eye,
  MapPin,
  GraduationCap,
  Briefcase,
  Users,
  Crown,
  Verified,
  ChevronRight,
  ChevronLeft,
  Phone
} from 'lucide-react';
import type React from 'react';
import type { Profile } from '../type';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { escapeHtml } from '@/src/lib/utils';
import { useSession } from 'next-auth/react';
import Loader from '@/src/components/ui/loader';

interface ProfilesListProps {
  profiles: Profile[];
  totalCount: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const ProfilesList: React.FC<ProfilesListProps> = ({
  profiles,
  totalCount,
  sortBy,
  onSortChange
}) => {
  const { data: session } = useSession(); // ✅ logged in user
  const router = useRouter();
  const [expressed, setExpressed] = useState<Record<string, boolean>>({});
  const [showProfileSelectModal, setShowProfileSelectModal] = useState(false);
  const [userProfiles, setUserProfiles] = useState<Profile[]>([]);
  const [pendingReceiverProfile, setPendingReceiverProfile] = useState<
    string | null
  >(null);
  const [pendingReceiverUser, setPendingReceiverUser] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const handleExpressInterest = async (
    receiverProfileId: string,
    receiverUserId: string
  ) => {
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
      const res = await fetch(
        `/api/profile-interest/${pendingReceiverProfile}/interests`,
        {
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
        }
      );

      const data = await res.json();
      if (data.success) {
        setExpressed((prev) => ({
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

  const handleSendMessage = (profileId: string) => {
    console.log('Send message:', profileId);
    // TODO: Implement send message functionality
  };

  const handleViewProfile = (profileId: string) => {
    console.log('View profile:', profileId);
    // TODO: Navigate to profile detail
  };

  const formatLastActive = (lastActive: string): string => {
    if (!lastActive) return 'Never active';
    if (lastActive === 'Online now') return 'Online now';

    const date = new Date(lastActive);
    if (isNaN(date.getTime())) return 'Never active';
    return `Last seen ${date.toLocaleString()}`;
  };

  // ✅ Agar logged in user ke profiles hai to unko Online now mark karo
  const enrichedProfiles = profiles.map((profile) => {
    if (session?.user?.id && profile.userId === session.user.id) {
      const lastActive = profile.lastActive; // ye DB ka value hona chahiye
      // if (lastActive instanceof Date) {
      //   lastActive = lastActive.toISOString();
      // }

      return {
        ...profile,
        lastActive:
          lastActive && !isNaN(new Date(lastActive).getTime())
            ? new Date(lastActive).toLocaleString()
            : 'Never active'
      };
    }
    return profile;
  });

  // Image Carousel Component
  const ProfileImageCarousel = ({ profile }: { profile: any }) => {
    const images = [
      profile.profileImage1,
      profile.profileImage2,
      profile.profileImage3
    ].filter(Boolean);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const getInitials = (name: string): string =>
      name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const goToPrevious = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    };

    const goToNext = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    };

    const goToImage = (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex(index);
    };

    return (
      <div className="relative w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl overflow-hidden group shadow-lg border-2 border-white">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={`${profile.name}'s profile`}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              onError={(e) => {
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

            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

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
                    />
                  ))}
                </div>

                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
            <div className="text-orange-600 text-3xl lg:text-4xl font-bold">
              {getInitials(profile.name)}
            </div>
          </div>
        )}

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

        {profile.lastActive === 'Online now' && (
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Loader in center */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
          <Loader />
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-red-900">Browse Profiles</h1>
          <p className="text-sm text-red-600 mt-1">Find your perfect match</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-red-600">
            {totalCount} profile{totalCount !== 1 ? 's' : ''} found
          </span>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recently-active">Recently Active</SelectItem>
              <SelectItem value="newest-first">Newest First</SelectItem>
              <SelectItem value="age-low-high">Age: Low to High</SelectItem>
              <SelectItem value="age-high-low">Age: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Profiles */}
      <div className="space-y-4">
        {enrichedProfiles?.map((profile) => (
          <Card
            key={profile.id}
            className="p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-shrink-0">
                <ProfileImageCarousel profile={profile} />
              </div>

              <div className="flex-grow space-y-4">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xl font-semibold text-red-900">
                        {profile.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-red-600 mt-1">
                        <span>{profile.age} years</span>
                        <span>•</span>
                        <span>{profile.height}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{profile.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {profile.education !== 'Not specified' && (
                        <div className="flex items-center gap-2 text-sm text-red-700">
                          <GraduationCap className="w-4 h-4" />
                          <span>{profile.education}</span>
                        </div>
                      )}

                      {(profile.occupation !== 'Not specified' ||
                        profile.company !== 'Not specified') && (
                        <div className="flex items-center gap-2 text-sm text-red-700">
                          <Briefcase className="w-4 h-4" />
                          <span>
                            {profile.occupation !== 'Not specified' &&
                            profile.company !== 'Not specified'
                              ? `${profile.occupation} at ${profile.company}`
                              : profile.occupation !== 'Not specified'
                                ? profile.occupation
                                : profile.company}
                          </span>
                        </div>
                      )}

                      {profile.gotra !== 'Not specified' && (
                        <div className="flex items-center gap-2 text-sm text-red-700">
                          <Users className="w-4 h-4" />
                          <span>Gotra: {profile.gotra}</span>
                        </div>
                      )}
                    </div>

                    {profile.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {profile.interests
                          .slice(0, 5)
                          .map((interest, index) => (
                            <Badge
                              key={`${interest}-${index}`}
                              variant="secondary"
                              className="text-xs text-red-800"
                            >
                              {interest}
                            </Badge>
                          ))}
                        {profile.interests.length > 5 && (
                          <Badge
                            variant="outline"
                            className="text-xs text-red-800"
                          >
                            +{profile.interests.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* <div className="text-right text-sm text-red-500">
                    {formatLastActive(profile.lastActive)}
                  </div> */}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={expressed[profile.id]}
                    onClick={() =>
                      handleExpressInterest(profile.id, profile.userId)
                    }
                    className="flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    {expressed[profile.id]
                      ? 'Interest Sent'
                      : 'Express Interest'}
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleSendMessage(profile.id)}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (session?.user?.role === 'user') {
                        router.push(`/dashboard/search-profile/${profile.id}`);
                      } else {
                        router.push(`/admin/search-profile/${profile.id}`);
                      }
                    }}
                    className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Eye className="w-4 h-4" />
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {enrichedProfiles?.length === 0 && (
        <Card className="p-8 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              No profiles found matching your criteria
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your filters to see more results, or check back
              later for new profiles.
            </p>
          </div>
        </Card>
      )}

      {enrichedProfiles?.length > 0 && enrichedProfiles.length >= 10 && (
        <div className="text-center pt-6">
          <Button variant="outline" className="px-8 bg-transparent">
            Load More Profiles
          </Button>
        </div>
      )}

      {showProfileSelectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg w-80 max-h-[80vh] overflow-y-auto space-y-4">
            <h2 className="text-lg font-semibold text-red-900">
              Select Your Profile
            </h2>
            <div className="space-y-2">
              {userProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="p-2 border rounded hover:bg-red-50 cursor-pointer"
                  onClick={() => sendInterest(profile.id)}
                >
                  {profile.name} ({profile.profileRelation} )
                </div>
              ))}
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
};

export default ProfilesList;
