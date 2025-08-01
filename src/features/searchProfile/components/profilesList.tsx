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
} from "lucide-react";
import type React from "react";
import type { Profile } from "../type";
import { useRouter } from "next/navigation";


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
  const router = useRouter()

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Profiles</h1>
          <p className="text-sm text-gray-600 mt-1">Find your perfect match</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
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
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage || "/placeholder.svg"}
                      alt={`${profile.name}'s profile`}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="text-gray-400 text-2xl font-bold">${getInitials(
                            profile.name
                          )}</div>`;
                        }
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 text-2xl font-bold">
                      {getInitials(profile.name)}
                    </div>
                  )}

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
                      <h3 className="text-xl font-semibold text-gray-900">
                        {profile.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
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
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <GraduationCap className="w-4 h-4" />
                          <span>{profile.education}</span>
                        </div>
                      )}

                      {(profile.occupation !== "Not specified" ||
                        profile.company !== "Not specified") && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
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
                        <div className="flex items-center gap-2 text-sm text-gray-700">
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
                              className="text-xs"
                            >
                              {interest}
                            </Badge>
                          ))}
                        {profile.interests.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.interests.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-right text-sm text-gray-500">
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
                    onClick={() => router.push(`/search-profile/${profile.id}`)}
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
