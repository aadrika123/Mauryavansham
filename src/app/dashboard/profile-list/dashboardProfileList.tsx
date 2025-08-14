"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
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
  Bell,
  LogOut,
  Verified,
  LayoutDashboard,
  ShoppingBag,
  HandHeart,
  Trophy,
  Globe,
  MessageSquare,
  Settings,
  User,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Clock,
  Star,
  UserX,
} from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Profile Image Carousel Component
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

// Online Status Component
const OnlineStatus = ({ lastActive }: { lastActive: string }) => {
  if (lastActive === "Online now") {
    return (
      <div className="flex items-center gap-2 text-green-600 font-medium">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm">Online now</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <Clock className="w-3 h-3" />
      <span className="text-sm">
        {lastActive === "Never" ? "Never active" : `Last seen ${lastActive}`}
      </span>
    </div>
  );
};

export default function DashboardProfileList(props: any) {
  const router = useRouter();
  const [deactivatingProfile, setDeactivatingProfile] = useState<string | null>(null);
  
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

  const handleDeactivateProfile = async (profileId: string) => {
  try {
    setDeactivatingProfile(profileId);

    const confirmed = window.confirm(
      "Are you sure you want to deactivate this profile? This action can be reversed later."
    );

    if (!confirmed) {
      setDeactivatingProfile(null);
      return;
    }

    // ✅ Build FormData for server action
    const formData = new FormData();
    formData.append("isDeleted", "true");
    formData.append("isActive", "false");

    const res = await props.updateProfileById(formData, profileId);

    if (res.success) {
      alert("Profile deactivated successfully!");
      if (props.onProfileUpdated) {
        props.onProfileUpdated();
      }
    } else {
      alert(res.message || "Failed to deactivate profile.");
    }
  } catch (error) {
    console.error("Error deactivating profile:", error);
    alert("Failed to deactivate profile. Please try again.");
  } finally {
    setDeactivatingProfile(null);
  }
};

  console.log(props?.profileList, "profileList");

  return (
    <div className="space-y-6 w-[70%]">
      {props?.profileList?.map((profile: any) => (
        <Card
          key={profile.id}
          className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:scale-[1.02] group"
        >
          {/* Card Header with Gradient Background */}
          <div className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 p-6 pb-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Profile Image Carousel */}
              <div className="flex-shrink-0">
                <ProfileImageCarousel profile={profile} />
              </div>

              {/* Profile Header Info */}
              <div className="flex-grow space-y-4">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-800 capitalize">
                          {profile.name}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className="bg-gradient-to-r from-orange-100 to-red-100 text-red-700 border-red-200 font-medium px-3 py-1"
                        >
                          {profile.profileRelation}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">{profile.age} years</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">{profile.height}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">{profile.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <OnlineStatus lastActive={profile.lastActive} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 pt-4">
            <div className="space-y-4">
              {/* Professional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.education !== "Not specified" && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Education</p>
                      <p className="text-sm font-semibold text-blue-800 capitalize">{profile.education}</p>
                    </div>
                  </div>
                )}

                {(profile.occupation !== "Not specified" || profile.company !== "Not specified") && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Profession</p>
                      <p className="text-sm font-semibold text-purple-800 capitalize">
                        {profile.occupation !== "Not specified" && profile.company !== "Not specified"
                          ? `${profile.occupation} at ${profile.company}`
                          : profile.occupation !== "Not specified"
                          ? profile.occupation
                          : profile.company}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Gotra Information */}
              {profile.gotra !== "Not specified" && (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 max-w-md">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Gotra</p>
                    <p className="text-sm font-semibold text-green-800 capitalize">{profile.gotra}</p>
                  </div>
                </div>
              )}

              {/* Interests */}
              {profile.interests && profile.interests.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-orange-500" />
                    Interests & Hobbies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests
                      .slice(0, 6)
                      .map((interest: string, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gradient-to-r from-orange-50 to-red-50 text-red-700 border-red-200 hover:from-orange-100 hover:to-red-100 transition-colors px-3 py-1 text-xs font-medium"
                        >
                          {interest}
                        </Badge>
                      ))}
                    {profile.interests.length > 6 && (
                      <Badge
                        variant="outline"
                        className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border-gray-300 px-3 py-1 text-xs font-medium"
                      >
                        +{profile.interests.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                size="default"
                onClick={() =>
                  router.push(`/dashboard/view-profile/${profile.id}`)
                }
                className="flex items-center justify-center gap-3 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300 font-medium group/btn"
              >
                <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                View Profile
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() =>
                  router.push(`/dashboard/edit-profile/${profile.id}`)
                }
                className="flex items-center justify-center gap-3 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 transition-all duration-300 font-medium group/btn"
              >
                <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={() => handleDeactivateProfile(profile.id)}
                disabled={deactivatingProfile === profile.id}
                className="flex items-center justify-center gap-3 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-300 font-medium group/btn disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserX className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                {deactivatingProfile === profile.id ? "Deactivating..." : "Deactivate Profile"}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}