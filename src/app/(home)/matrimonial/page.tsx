"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  ArrowLeft,
  Crown,
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Profile } from "@/src/features/searchProfile/type";
// import { Profile } from "@/src/features/searchProfile/type";
import { useSession } from "next-auth/react";
import { LeftSideAddBanner } from "@/src/components/common/LeftSideAddBanner";
import { VerticalAdBanner } from "@/src/components/common/VerticalAdBanner";

type Props = {
  initialProfiles: Profile[];
};
export default function MatrimonialPage({ initialProfiles }: Props) {
  const [searchFilters, setSearchFilters] = useState({
    ageFrom: "",
    ageTo: "",
    cityState: "",
  });
  console.log(initialProfiles);
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user; // Check if user is authenticated
  const userName = session?.user?.name || "User";

  const profiles = [
    {
      id: 1,
      name: "Anita Maurya",
      age: 26,
      gotra: "Kashyap Gotra",
      location: "Delhi, India",
      profession: "Software Engineer",
      education: "B.Tech Computer Science",
      familyType: "Joint Family",
      image: "/placeholder.svg?height=120&width=120&text=AM",
    },
    {
      id: 2,
      name: "Rohit Kushwaha",
      age: 32,
      gotra: "Bharadwaj Gotra",
      location: "Mumbai, India",
      profession: "Business Owner",
      education: "MBA Finance",
      familyType: "Nuclear Family",
      image: "/placeholder.svg?height=120&width=120&text=RK",
    },
    {
      id: 3,
      name: "Priya Maurya",
      age: 28,
      gotra: "Vasishta Gotra",
      location: "Bangalore, India",
      profession: "Doctor",
      education: "MBBS",
      familyType: "Joint Family",
      image: "/placeholder.svg?height=120&width=120&text=PM",
    },
    {
      id: 4,
      name: "Vikash Maurya",
      age: 31,
      gotra: "Gautam Gotra",
      location: "Pune, India",
      profession: "Chartered Accountant",
      education: "CA",
      familyType: "Nuclear Family",
      image: "/placeholder.svg?height=120&width=120&text=VM",
    },
  ];

  const successStories = [
    {
      couple: "Rahul & Kavya Maurya",
      marriedDate: "Married in March 2024",
      testimonial:
        "We found each other through Mauryavansh matrimonial and it was the best decision of our lives. Thank you for helping us find our soulmates!",
      icon: "💛",
    },
    {
      couple: "Amit & Priya Kushwaha",
      marriedDate: "Married in January 2024",
      testimonial:
        "The platform helped us connect based on shared values and family traditions. We are grateful for this wonderful community service.",
      icon: "❤️",
    },
  ];

  const handleSearch = () => {
    console.log("Searching with filters:", searchFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>
          <span>/</span>
          <span>Matrimonial Services</span>
        </div>
      </div>
      <div className="absolute top-72 left-16 z-50">
        <LeftSideAddBanner />
      </div>
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8 text-center">
        <Crown className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg transform "></div>
          <h1 className="relative text-3xl md:text-4xl font-bold text-red-700">
            Maurya Matrimonial
          </h1>
        </div>
        <p className="text-lg text-red-600 max-w-4xl mx-auto leading-relaxed mb-12">
          Find your perfect life partner within our respected Maurya community.
          Build a future together rooted in our shared values and heritage.
        </p>
      </div>

      {/* Search Section */}
      {/* <div className="container mx-auto px-4 mb-12">
        <Card className="bg-yellow-50 border-yellow-200 shadow-lg max-w-4xl mx-auto hover:shadow-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-red-700">
              <Heart className="h-5 w-5" />
              <h2 className="text-xl font-bold">Find Your Life Partner</h2>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <Input
                placeholder="Age from"
                value={searchFilters.ageFrom}
                onChange={(e) => setSearchFilters({ ...searchFilters, ageFrom: e.target.value })}
                className="bg-white border-yellow-300 focus:border-red-500"
              />
              <Input
                placeholder="Age to"
                value={searchFilters.ageTo}
                onChange={(e) => setSearchFilters({ ...searchFilters, ageTo: e.target.value })}
                className="bg-white border-yellow-300 focus:border-red-500"
              />
              <Input
                placeholder="City/State"
                value={searchFilters.cityState}
                onChange={(e) => setSearchFilters({ ...searchFilters, cityState: e.target.value })}
                className="bg-white border-yellow-300 focus:border-red-500"
              />
              <Button
                onClick={handleSearch}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                Search Profiles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Create Profile CTA */}
      <div className="container mx-auto px-4 mb-12">
        <div className="bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] rounded-lg p-8 text-center text-white max-w-4xl mx-auto">
          <Heart className="h-16 w-16 mx-auto mb-4 text-white" />
          <h2 className="text-2xl font-bold mb-4">
            Create Your Matrimonial Profile
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of Maurya families who have found their perfect match
            through our platform
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              asChild
              className={`bg-white text-red-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold `}
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? (
                <Link href="/search-profile">Search Profile</Link>
              ) : (
                <Link href="/sign-in">
                  <span>Login To Search Profile</span>
                </Link>
              )}
            </Button>
            <Button
              asChild
              className={`bg-white text-red-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold `}
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? (
                <Link href="/create-profile">Create Profile Now</Link>
              ) : (
                <Link href="/sign-in">
                  <span>Login To Create Profile</span>
                </Link>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Cards Grid */}
      {/* <div className="container mx-auto px-4 mb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles?.map((profile) => (
            <Card
              key={profile.id}
              className="bg-yellow-50 border-yellow-200 hover:shadow-lg transition-shadow hover:shadow-yellow-200"
            >
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 mx-auto rounded-full border-4 border-yellow-400 overflow-hidden">
                    <img
                      src={profile.image || "/placeholder.svg"}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-red-700 mb-1">
                  {profile.name}
                </h3>
                <p className="text-sm text-red-600 mb-4">
                  {profile.age} years • {profile.gotra}
                </p>

                <div className="space-y-2 text-sm text-gray-700 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Briefcase className="h-4 w-4 text-red-500" />
                    <span>{profile.profession}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <GraduationCap className="h-4 w-4 text-red-500" />
                    <span>{profile.education}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4 text-red-500" />
                    <span>{profile.familyType}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                  >
                    View Profile
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                    Express Interest
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div> */}

      {/* Success Stories */}
      <div className="container mx-auto px-4 pb-12">
        <div className="text-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg transform "></div>
            <h2 className="relative text-2xl font-bold text-red-700">
              Success Stories
            </h2>
          </div>
        </div>
        <div className="mt-8 mb-12">
          <VerticalAdBanner />
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {successStories.map((story, index) => (
            <Card
              key={index}
              className="bg-yellow-50 border-yellow-200 hover:shadow-yellow-200 transition-shadow shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-xl">
                    {story.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-red-700">{story.couple}</h3>
                    <p className="text-sm text-red-600">{story.marriedDate}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{story.testimonial}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
