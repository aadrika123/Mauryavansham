"use client";

import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
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
} from "lucide-react";
import type React from "react";
import type { Profile } from "../type";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  onSortChange,
}) => {
  console.log("ProfilesList received profiles:", profiles);
  const router = useRouter();

  const handleExpressInterest = (profileId: string) => {
    console.log("Express interest:", profileId);
    // TODO: Implement express interest functionality
  };

  const handleSendMessage = (profileId: string) => {
    console.log("Send message:", profileId);
    // TODO: Implement send message functionality
  };

  const handleViewProfile = (profileId: string) => {
    console.log("View profile:", profileId);

    // TODO: Implement view profile functionality - could navigate to profile detail page
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastActive = (lastActive: string): string => {
    if (lastActive === "Never") return "Never active";
    if (lastActive === "Online now") return "Online now";
    return `Last seen ${lastActive}`;
  };
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
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    };

    const goToNext = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    };

    const goToImage = (index: number, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent card click
      setCurrentImageIndex(index);
    };

    return (
      <div className="relative w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl overflow-hidden group shadow-lg border-2 border-white">
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
        {profile.lastActive === "Online now" && (
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-lg animate-pulse"></div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-red-900">Browse Profiles</h1>
          <p className="text-sm text-red-600 mt-1">Find your perfect match</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-red-600">
            {totalCount} profile{totalCount !== 1 ? "s" : ""} found
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
        {profiles?.map((profile) => (
          <Card
            key={profile.id}
            className="p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-200 rounded-lg flex items-center justify-center relative">
                  <div className="flex-shrink-0">
                    <ProfileImageCarousel profile={profile} />
                  </div>

                  {/* Badges */}
                  <div className="absolute -top-6 -right-2 ">
                    {profile.isPremium && (
                      <Crown className="w-7 h-7 text-orange-600 text-" />
                    )}
                    {profile.isVerified && (
                      <Verified className=" w-7 h-7 text-green-600" />
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details */}
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
                      {profile.education !== "Not specified" && (
                        <div className="flex items-center gap-2 text-sm text-red-700">
                          <GraduationCap className="w-4 h-4" />
                          <span>{profile.education}</span>
                        </div>
                      )}

                      {(profile.occupation !== "Not specified" ||
                        profile.company !== "Not specified") && (
                        <div className="flex items-center gap-2 text-sm text-red-700">
                          <Briefcase className="w-4 h-4" />
                          <span>
                            {profile.occupation !== "Not specified" &&
                            profile.company !== "Not specified"
                              ? `${profile.occupation} at ${profile.company}`
                              : profile.occupation !== "Not specified"
                              ? profile.occupation
                              : profile.company}
                          </span>
                        </div>
                      )}

                      {profile.gotra !== "Not specified" && (
                        <div className="flex items-center gap-2 text-sm text-red-700">
                          <Users className="w-4 h-4" />
                          <span>Gotra: {profile.gotra}</span>
                        </div>
                      )}
                    </div>

                    {/* Interests */}
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

                  <div className="text-right text-sm text-red-500">
                    {formatLastActive(profile.lastActive)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExpressInterest(profile.id)}
                    className="flex items-center gap-2 hover:bg-pink-50 hover:border-pink-300"
                  >
                    <Heart className="w-4 h-4" />
                    Express Interest
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
                    onClick={() =>
                      router.push(`/dashboard/search-profile/${profile.id}`)
                    }
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

      {/* Empty State */}
      {profiles?.length === 0 && (
        <Card className="p-8 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-500 font-medium">
                No profiles found matching your criteria
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Try adjusting your filters to see more results, or check back
                later for new profiles.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Load More Section - Placeholder for future pagination */}
      {profiles?.length > 0 && profiles.length >= 10 && (
        <div className="text-center pt-6">
          <Button variant="outline" className="px-8 bg-transparent">
            Load More Profiles
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfilesList;
