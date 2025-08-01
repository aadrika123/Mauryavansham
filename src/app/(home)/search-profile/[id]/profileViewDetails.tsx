"use client"

import { Card } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Separator } from "@/src/components/ui/separator"
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
} from "lucide-react"
import Link from "next/link"
import type { DetailedProfile } from "@/src/features/searchProfile/type"

interface ProfileDetailViewProps {
  profile: DetailedProfile
}

export default function ProfileDetailView({ profile }: ProfileDetailViewProps) {
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleExpressInterest = () => {
    console.log("Express interest:", profile.id)
  }

  const handleSendMessage = () => {
    console.log("Send message:", profile.id)
  }

  return (
    <div className="min-h-screen bg-orange-50">
     {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/search-profile" className="text-red-600 hover:underline">
            Search Profiles
          </Link>
          <span>/</span>
          <span>Search Profile Details</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="p-6">
              <div className="text-center space-y-4">
                {/* Profile Image */}
                <div className="relative mx-auto w-32 h-32">
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center relative overflow-hidden">
                    {profile.profileImage ? (
                      <img
                        src={profile.profileImage || "/placeholder.svg"}
                        alt={`${profile.name}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 text-3xl font-bold">{getInitials(profile.name)}</div>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                    {profile.isPremium && (
                      <Badge className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-2 py-1">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {profile.isVerified && (
                      <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
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

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    onClick={handleExpressInterest}
                    className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700"
                  >
                    <Heart className="w-4 h-4" />
                    Express Interest
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
                  <p className="text-gray-900 capitalize">{profile.personalDetails.maritalStatus.replace("-", " ")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Languages Known</label>
                  <p className="text-gray-900">{profile.personalDetails.languagesKnown.join(", ")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Religious Beliefs</label>
                  <p className="text-gray-900 capitalize">
                    {profile.personalDetails.religiousBeliefs.replace("-", " ")}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">Diet</p>
                    <p className="text-sm font-medium capitalize">{profile.personalDetails.diet.replace("-", " ")}</p>
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

              {profile.familyDetails.familyHistory !== "Not specified" && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <label className="text-sm font-medium text-gray-600">Family History</label>
                    <p className="text-gray-700 mt-1">{profile.familyDetails.familyHistory}</p>
                  </div>
                </>
              )}

              {profile.familyDetails.familyTraditions !== "Not specified" && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-600">Family Traditions</label>
                  <p className="text-gray-700 mt-1">{profile.familyDetails.familyTraditions}</p>
                </div>
              )}

              {profile.familyDetails.communityContributions !== "Not specified" && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-600">Community Contributions</label>
                  <p className="text-gray-700 mt-1">{profile.familyDetails.communityContributions}</p>
                </div>
              )}
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
                <p className="text-gray-700 mt-1 capitalize">{profile.preferences.castPreferences.replace("-", " ")}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
