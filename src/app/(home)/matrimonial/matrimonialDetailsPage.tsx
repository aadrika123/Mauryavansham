"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { ArrowLeft, Crown, Eye, Heart, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { Profile } from "@/src/features/searchProfile/type";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { format } from "date-fns";

type Props = {
  initialProfiles: Profile[];
};
interface AdPlacement {
  id: number;
  bannerImageUrl: string;
  link?: string;
  views: number;
  placementId: number;
}

export default function MatrimonialPage({ initialProfiles }: Props) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);

  useEffect(() => {
    fetch("/api/ad-placements/approved")
      .then((res) => res.json())
      .then((data: AdPlacement[]) => {
        setAdPlacements(data);
      })
      .catch(() => console.error("Failed to load ad placements"));
  }, []);

  const leftTopAd = adPlacements.find((ad) => ad.placementId === 6);
  const bottomAd = adPlacements.find((ad) => ad.placementId === 7);
  useEffect(() => {
    if (leftTopAd)
      fetch(`/api/ad-placements/${leftTopAd.id}`, { method: "POST" });
    if (bottomAd)
      fetch(`/api/ad-placements/${bottomAd.id}`, { method: "POST" });
  }, [leftTopAd, bottomAd]);

  // ✅ Carousel Logic
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMoreThanTwo = initialProfiles.length > 2;

  const itemsPerSlide = 2;
  const totalSlides = Math.ceil(initialProfiles.length / itemsPerSlide);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const start = currentIndex * itemsPerSlide;
  const visibleProfiles = hasMoreThanTwo
    ? initialProfiles.slice(start, start + itemsPerSlide)
    : initialProfiles;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Breadcrumb */}
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

      {/* Left Ad */}
      <div className="absolute top-96 left-16 z-50 hidden lg:block w-[18rem] flex-shrink-0">
        {leftTopAd ? (
          <>
            <Image
              src={leftTopAd.bannerImageUrl}
              alt="left top Ad"
              className="w-full h-auto object-cover shadow-lg rounded-2xl"
              width={288}
              height={450}
              priority
            />
            <div className="absolute bottom-2 right-2 bg-black/30 text-white text-sm px-2 py-1 rounded">
              {leftTopAd.views} <Eye className="w-4 h-4 " />
            </div>
          </>
        ) : (
          <div className="w-full text-center h-[450px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
            Ad Space (6) <br />
            (350x450 pixels)
          </div>
        )}
      </div>

      {/* Header */}
      <div className="container mx-auto text-center -mt-12">
        <Crown className="h-20 w-20 text-yellow-500 mx-auto" />
        <div className="relative">
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

      {/* CTA */}
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
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? (
                <Link href="/dashboard/search-profile">Search Profile</Link>
              ) : (
                <Link href="/sign-in">Login To Search Profile</Link>
              )}
            </Button>
            <Button
              asChild
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? (
                <Link href="/dashboard/create-profile">Create Profile Now</Link>
              ) : (
                <Link href="/sign-in">Login To Create Profile</Link>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ Success Stories */}
      <div className="container mx-auto px-4 pb-12 mt-20 relative">
        <div className="text-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg"></div>
            <h2 className="relative text-2xl font-bold text-red-700">
              Success Stories
            </h2>
          </div>
        </div>

        <div className="flex items-center justify-center max-w-4xl mx-auto relative">
          {/* Prev Button */}
          {hasMoreThanTwo && (
            <button
              onClick={handlePrev}
              className="absolute left-0 bg-yellow-200 p-2 rounded-full hover:bg-yellow-300 transition"
            >
              {"<"}
            </button>
          )}

          {/* Cards */}
          <div
            className={`grid ${
              hasMoreThanTwo ? "md:grid-cols-2" : "md:grid-cols-2"
            } gap-6 w-full px-10`}
          >
            {visibleProfiles.map((profile) => (
              <Card
                key={profile.id}
                className="bg-yellow-50 border-yellow-200 hover:shadow-yellow-200 transition-shadow shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div>
                      <h3 className="font-bold text-red-700">{profile.name}</h3>
                      <p className="text-sm text-red-600">
                        {profile.deactivateReason} in{" "}
                        {profile.updatedAt
                          ? format(new Date(profile.updatedAt), "dd MMM yyyy")
                          : ""}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">
                    "{profile.deactivateReview}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Next Button */}
          {hasMoreThanTwo && (
            <button
              onClick={handleNext}
              className="absolute right-0 bg-yellow-200 p-2 rounded-full hover:bg-yellow-300 transition"
            >
              {">"}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Ad */}
      <div className="mt-8 mb-12">
        <div className="container mx-auto px-8 py-2 w-5/6">
          <div className="relative">
            {bottomAd ? (
              <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <div className="relative p-8 text-center">
                  <Image
                    src={bottomAd.bannerImageUrl}
                    alt={"Ad Banner"}
                    width={400}
                    height={500}
                    className="mx-auto rounded-xl shadow-lg"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/30 text-white text-sm px-2 py-1 rounded">
                    {bottomAd.views} <Eye className="w-4 h-4 inline" />
                  </div>
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
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                    <div className="text-center relative z-10 flex flex-col justify-center items-center h-full">
                      <div className="relative border-2 border-dashed border-amber-400 rounded-lg p-8 bg-gradient-to-br from-amber-50 to-yellow-100">
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
                          <p className="text-sm text-amber-600 mt-2">
                            Go to your dashboard to create and manage ads.
                          </p>
                        </div>
                      </div>
                    </div>
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
