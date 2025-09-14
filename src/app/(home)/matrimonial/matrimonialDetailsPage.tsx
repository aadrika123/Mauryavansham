"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { ArrowLeft, Crown, Heart } from "lucide-react";
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

  // ✅ Responsive Carousel Logic
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1); // mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2); // tablet
      } else {
        setItemsPerSlide(3); // desktop
      }
    };
    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  const totalSlides = Math.ceil(initialProfiles.length / itemsPerSlide);
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const start = currentIndex * itemsPerSlide;
  const visibleProfiles = initialProfiles.slice(start, start + itemsPerSlide);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>
          <span>/</span>
          <span>Matrimonial Services</span>
        </div>
      </div>

      {/* Left Ad - hidden on small screens */}
      <div className="hidden lg:block absolute top-96 left-6 z-40 w-60 xl:w-72">
        {leftTopAd ? (
          <Image
            src={leftTopAd.bannerImageUrl}
            alt="left top Ad"
            className="w-full h-auto object-cover shadow-lg rounded-2xl"
            width={350}
            height={500}
            priority
          />
        ) : (
          <div className="w-full h-[300px] xl:h-[450px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 text-center text-sm p-2">
            Ad Space (6) <br />
            (350x500 px)
          </div>
        )}
      </div>

      {/* Header */}
      <div className="container mx-auto text-center mt-6 sm:mt-0 px-4">
        <Crown className="h-16 sm:h-20 w-16 sm:w-20 text-yellow-500 mx-auto" />
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg"></div>
          <h1 className="relative text-2xl sm:text-3xl md:text-4xl font-bold text-red-700">
            Maurya Matrimonial
          </h1>
        </div>
        <p className="text-base sm:text-lg text-red-600 max-w-2xl md:max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12">
          Find your perfect life partner within our respected Maurya community.
          Build a future together rooted in our shared values and heritage.
        </p>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 mb-12">
        <div className="bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] shadow-xl rounded-lg p-6 sm:p-8 text-center text-white max-w-3xl lg:max-w-4xl mx-auto">
          <Heart className="h-12 sm:h-16 w-12 sm:w-16 mx-auto mb-4 text-white" />
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            Create Your Matrimonial Profile
          </h2>
          <p className="text-sm sm:text-lg mb-6 opacity-90">
            Join thousands of Maurya families who have found their perfect match
            through our platform
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Button
              asChild
              className="bg-white text-red-600 hover:bg-gray-100 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg font-semibold"
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
              className="bg-white text-red-600 hover:bg-gray-100 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg font-semibold"
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
      <div className="container mx-auto px-4 pb-12 mt-12 sm:mt-20 relative">
        <div className="text-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg"></div>
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-bold text-red-700">
              Success Stories
            </h2>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          {/* Prev Button */}
          {initialProfiles.length > itemsPerSlide && (
            <button
              onClick={handlePrev}
              className="absolute -left-3 sm:left-0 bg-yellow-200 p-2 rounded-full hover:bg-yellow-300 transition"
            >
              {"<"}
            </button>
          )}

          {/* Cards */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${itemsPerSlide} gap-6 w-full`}
          >
            {visibleProfiles.map((profile) => (
              <Card
                key={profile.id}
                className="bg-yellow-50 border-yellow-200 hover:shadow-yellow-200 transition-shadow shadow-lg"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-red-700">{profile.name}</h3>
                    <p className="text-xs sm:text-sm text-red-600">
                      {profile.deactivateReason} in{" "}
                      {profile.updatedAt
                        ? format(new Date(profile.updatedAt), "dd MMM yyyy")
                        : ""}
                    </p>
                  </div>
                  <p className="text-gray-700 italic text-sm sm:text-base">
                    "{profile.deactivateReview}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Next Button */}
          {initialProfiles.length > itemsPerSlide && (
            <button
              onClick={handleNext}
              className="absolute -right-3 sm:right-0 bg-yellow-200 p-2 rounded-full hover:bg-yellow-300 transition"
            >
              {">"}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Ad */}
      <div className="mt-8 pb-12 px-4">
        <div className="container mx-auto">
          <div className="relative">
            {bottomAd ? (
              <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden">
                <div className="relative p-4 sm:p-8 text-center">
                  <Image
                    src={bottomAd.bannerImageUrl}
                    alt="Ad Banner"
                    width={600}
                    height={300}
                    className="mx-auto rounded-xl shadow-lg w-full max-w-[900px] h-auto"
                  />
                </div>
              </div>
            ) : (
              <div className="mx-auto relative w-full max-w-[900px] h-[200px] sm:h-[250px] md:h-[300px]">
                <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl w-full h-full flex items-center justify-center text-center p-4">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-800">
                    Book Your Ad (7) <br />
                    <span className="text-sm font-normal">
                      Please select image size of (900x300 px)
                    </span>
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
