"use client";

import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  ArrowLeft,
  Crown,
  BookOpen,
  Scroll,
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

interface AdPlacement {
  id: number;
  bannerImageUrl: string;
  link?: string;
  views: number;
  placementId: number;
  adUrl: string;
}

// Heritage Ad Slider Component for Placement 4
const HeritageAdSlider: React.FC<{ ads: AdPlacement[] }> = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, [ads.length]);

  // Track view when ad changes
  useEffect(() => {
    if (ads[currentIndex]) {
      fetch(`/api/ad-placements/${ads[currentIndex].id}`, { method: "POST" });
    }
  }, [currentIndex, ads]);

  if (ads.length === 0) {
    return (
      <div className="mx-auto relative w-full max-w-[900px] h-[180px] sm:h-[250px] md:h-[300px] flex items-center justify-center border-2 border-dashed border-amber-400 rounded-xl bg-amber-50">
        <p className="text-sm sm:text-lg text-amber-700 text-center px-2">
          Book Your Ad (4) – Recommended size: 900x300px
        </p>
      </div>
    );
  }

  return (
     <div className="relative w-full max-w-[900px] mx-auto h-[180px] sm:h-[220px] md:h-[300px]">
      <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 w-full h-full">
        <div className="relative p-4 sm:p-6 md:p-8 w-full h-full">
          {/* Ad Images */}
          {ads.map((ad, index) => (
            <div
              key={ad.id}
              className={`absolute inset-0  transition-opacity duration-1000 ${
                index === currentIndex
                  ? "opacity-100 z-10"
                  : "opacity-0 pointer-events-none z-0"
              }`}
            >
              <a
                href={ad.adUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full h-full"
              >
                <img
                  src={ad.bannerImageUrl}
                  alt={`Ad ${index + 1}`}
                  className="mx-auto rounded-xl shadow-lg w-full h-full object-fill"
                />
              </a>
            </div>
          ))}

          {/* Ad Counter - only show if multiple ads */}
          {ads.length > 1 && (
            <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-20">
              {currentIndex + 1} / {ads.length}
            </div>
          )}

          {/* Navigation Dots - only show if multiple ads */}
          {ads.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? "bg-amber-600 scale-125"
                      : "bg-amber-400/50 hover:bg-amber-400/75"
                  }`}
                  aria-label={`Go to ad ${index + 1}`}
                  type="button"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function HeritagePage() {
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);
  const [heritageList, setHeritageList] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/ad-placements/approved")
      .then((res) => res.json())
      .then((data: AdPlacement[]) => setAdPlacements(data))
      .catch(() => console.error("Failed to load ad placements"));
  }, []);
  useEffect(() => {
    fetch("/api/heritage/list")
      .then((res) => res.json())
      .then((data) => {
        // Process heritage data if needed
        console.log("Heritage Data:", data);
        setHeritageList(data);
      })
  }, []);


  // Filter ads for placement 4 (heritage page banner)
  const heritageAds = adPlacements.filter((ad) => ad.placementId === 4);

  console.log("Heritage Ads (Placement 4):", heritageAds);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto py-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>
          <span>/</span>
          <span>Heritage & History</span>
        </div>
      </div>

    <div className="container mx-auto text-center">
      {/* Hero Section */}
      <div className="mb-6">
        <Crown className="h-16 w-16 sm:h-20 sm:w-20 text-yellow-500 mx-auto " />
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg"></div>
          <h1 className="relative text-3xl sm:text-4xl md:text-5xl font-bold text-red-700 mb-4 sm:mb-6">
            Our Glorious Heritage
          </h1>
        </div>
        <p className="text-base sm:text-lg text-red-600 max-w-3xl mx-auto leading-relaxed px-2">
          From the divine lineage of Lord Ram to the mighty Mauryan Empire,
          discover the rich history and proud heritage of the Maurya community
          that spans over 2500 years.
        </p>
      </div>

      {/* Heritage Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 md:px-10 lg:px-36">
        {heritageList.length === 0 ? (
          <p className="text-gray-600 text-center col-span-full">
            No heritage records found.
          </p>
        ) : (
          heritageList.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="h-48 sm:h-64 bg-gradient-to-br from-blue-400 to-purple-600 relative overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <Crown className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-400 absolute top-4 left-4" />
              </div>

              <CardContent className="p-4 sm:p-6 bg-yellow-50">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-red-700">
                    {item.title}
                  </h3>
                  {item.badge && (
                    <Badge className="bg-yellow-200 text-yellow-800 border-yellow-300 text-xs sm:text-sm">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-700 text-sm sm:text-base text-left">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>

      {/* Ad Banner with Slider */}
      <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-6">
        <HeritageAdSlider ads={heritageAds} />
      </div>

      {/* Sacred Knowledge Section */}
      <div className="bg-yellow-50 py-12 sm:py-16 px-4 sm:px-8">
        <div className="container mx-auto text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-700">
            Sacred Knowledge
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center bg-yellow-100 p-6 sm:p-8 rounded-lg shadow hover:shadow-yellow-200">
            <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-2">
              Ramayana
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              The epic tale of our divine ancestor Lord Ram
            </p>
          </div>
          <div className="text-center bg-yellow-100 p-6 sm:p-8 rounded-lg shadow hover:shadow-yellow-200">
            <Scroll className="h-12 w-12 sm:h-16 sm:w-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-2">
              Arthashastra
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              Chanakya's wisdom that guided the Mauryan Empire
            </p>
          </div>
          <div className="text-center bg-yellow-100 p-6 sm:p-8 rounded-lg shadow hover:shadow-yellow-200">
            <Crown className="h-12 w-12 sm:h-16 sm:w-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-red-700 mb-2">
              Edicts of Ashoka
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              The dharmic principles that shaped civilization
            </p>
          </div>
        </div>
      </div>

      {/* Divine Lineage Section */}
      <div className="bg-yellow-50 py-12 sm:py-16 px-4 sm:px-8">
        <div className="container mx-auto text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-700 mb-2">
            Our Divine Lineage
          </h1>
          <p className="text-base sm:text-lg text-red-600">
            The sacred genealogy connecting us to the divine
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
          {[
            "Lord Ram (Treta Yuga)",
            "Ikshvaku Dynasty",
            "Chandragupta Maurya (321 BCE)",
            "Samrat Ashoka (268 BCE)",
            "Modern Maurya/Kushwaha Community",
          ].map((title, idx) => (
            <div key={idx}>
              <div className="text-center">
                <Crown className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-600 mx-auto mb-2" />
                <h3 className="text-lg sm:text-xl font-bold text-red-700">
                  {title}
                </h3>
              </div>
              {idx < 4 && (
                <div className="flex justify-center">
                  <div className="w-1 h-8 sm:h-12 bg-yellow-400"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-yellow-50 py-8 px-4 sm:px-12">
        <div className="bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] text-white py-10 sm:py-16 rounded-2xl container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                धर्म (Dharma)
              </h3>
              <p className="text-orange-100 text-sm sm:text-base">
                Righteousness and moral duty
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                अर्थ (Artha)
              </h3>
              <p className="text-orange-100 text-sm sm:text-base">
                Prosperity and material security
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                काम (Kama)
              </h3>
              <p className="text-orange-100 text-sm sm:text-base">
                Love and emotional fulfillment
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                मोक्ष (Moksha)
              </h3>
              <p className="text-orange-100 text-sm sm:text-base">
                Liberation and spiritual growth
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
