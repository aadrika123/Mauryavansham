"use client";

import { useEffect, useState } from "react";
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
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Profile } from "@/src/features/searchProfile/type";
// import { Profile } from "@/src/features/searchProfile/type";
import { useSession } from "next-auth/react";
import { LeftSideAddBanner } from "@/src/components/common/LeftSideAddBanner";
import { VerticalAdBanner } from "@/src/components/common/VerticalAdBanner";
import Image from "next/image";

type Props = {
  initialProfiles: Profile[];
};
interface AdPlacement {
  id: number;
  bannerImageUrl: string;
  link?: string;
}
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

  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);
  useEffect(() => {
    fetch("/api/ad-placements/approved")
      .then((res) => res.json())
      .then((data: AdPlacement[]) => {
        // sirf approved ads le lo
        setAdPlacements(data);
      })
      .catch(() => console.error("Failed to load ad placements"));
  }, []);

  const leftTopAd = adPlacements.find((ad) => ad.id === 6);
  const bottomAd = adPlacements.find((ad) => ad.id === 7);

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
      <div className="absolute top-96 left-16 z-50">
        {/* <LeftSideAddBanner /> */}
        <div className="hidden lg:block w-[18rem] flex-shrink-0">
          {leftTopAd ? (
            <a
              href={leftTopAd.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={leftTopAd.bannerImageUrl}
                alt="left top Ad"
                className="w-full h-auto object-cover shadow-lg rounded-2xl"
                width={288}
                height={450}
                priority
              />
            </a>
          ) : (
            <div className="w-full text-center h-[450px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
              Ad Space (6) <br />
              (350x450 pixels)
            </div>
          )}
        </div>
      </div>
      {/* Header Section */}
      <div className="container mx-auto  text-center -mt-12">
        <Crown className="h-20 w-20 text-yellow-500 mx-auto" />
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg transform "></div>
          <h1 className="relative text-3xl md:text-4xl font-bold text-red-700 under">
            Maurya Matrimonial
          </h1>
        </div>
        <p className="text-lg text-red-600 max-w-4xl mx-auto leading-relaxed mb-12">
          Find your perfect life partner within our respected Maurya community.
          Build a future together rooted in our shared values and heritage.
        </p>
      </div>
      {/* Create Profile CTA */}
      <div className="container mx-auto px-4 mb-12">
        <div className="bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] shadow-xl shadow-orange-300 rounded-lg p-8 text-center text-white max-w-4xl mx-auto">
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
                <Link href="/dashboard/search-profile">Search Profile</Link>
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
                <Link href="/dashboard/create-profile">Create Profile Now</Link>
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
      <div className="mt-8 mb-12">
        <div className="container mx-auto px-8 py-2 w-5/6">
          <div className="relative">
            {bottomAd ? (
              <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <div className="relative p-8 text-center">
                  {/* <h3 className="text-xl md:text-3xl font-bold text-amber-800 mb-4">
                        {rightAd.title}
                      </h3>
                      <a
                        href={ad.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      > */}
                  <Image
                    src={bottomAd.bannerImageUrl}
                    alt={"Ad Banner"}
                    width={400}
                    height={500}
                    className="mx-auto rounded-xl shadow-lg"
                  />
                  {/* </a> */}
                </div>
              </div>
            ) : (
              <div
                className="mx-auto relative"
                style={{ width: 900, height: 300 }}
              >
                <div
                  className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 
               border-4 border-amber-300 rounded-2xl shadow-2xl 
               overflow-hidden transform hover:scale-105 transition-transform duration-300
               w-full h-full"
                >
                  <div className="relative p-8 w-full h-full">
                    {/* Decorative Book Pages Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>

                    {/* Content */}
                    <div className="text-center relative z-10 flex flex-col justify-center items-center h-full">
                      <div
                        className="relative border-2 border-dashed border-amber-400 rounded-lg p-8 
                     bg-gradient-to-br from-amber-50 to-yellow-100"
                      >
                        <h3 className="text-xl md:text-3xl font-bold text-amber-800 mb-4">
                          Book Your Ad (7) <br />
                          <p>Please select image size of (900x300 pixels)</p>
                        </h3>

                        <div className="space-y-4 relative">
                          <div className="absolute top-4 left-4">
                            <Sparkles className="h-8 w-8 text-amber-500 animate-pulse" />
                          </div>
                          <div className="absolute top-4 right-4">
                            <Star className="h-8 w-8 text-amber-500 animate-pulse" />
                          </div>

                          {/* <button
                          className="bg-gradient-to-r from-amber-500 to-yellow-500 
                         hover:from-amber-600 hover:to-yellow-600 
                         text-white font-bold py-3 px-8 rounded-full shadow-lg 
                         transform hover:scale-105 transition-all duration-200"
                        >
                          
                        </button> */}

                          <p className="text-sm text-amber-600 mt-2">
                            Go to your dashboard to create and manage ads.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Borders */}
                    <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
                    <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
