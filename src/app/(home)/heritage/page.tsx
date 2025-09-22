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
  Eye,
} from "lucide-react";
import Link from "next/link";
import { LeftSideAddBanner } from "@/src/components/common/LeftSideAddBanner";
import { VerticalAdBanner } from "@/src/components/common/VerticalAdBanner";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";

interface Ad {
  id: number;
  title: string;
  bannerImageUrl: string;
  link?: string;
}
interface AdPlacement {
  id: number;
  bannerImageUrl: string;
  link?: string;
  views: number;
  placementId: number;
}
export default function HeritagePage() {
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);

  useEffect(() => {
    fetch("/api/ad-placements/approved")
      .then((res) => res.json())
      .then((data: AdPlacement[]) => {
        setAdPlacements(data);
      })
      .catch(() => console.error("Failed to load ad placements"));
  }, []);
  const ad = adPlacements.find((ad) => ad.placementId === 4); // Assuming placement ID 4 is for the HeritagePage ad
  useEffect(() => {
    if (ad) fetch(`/api/ad-placements/${ad.id}`, { method: "POST" });
  }, [ad]);
  return (
    <div className="min-h-screen px-12 bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>
          <span>/</span>
          <span>Heritage & History</span>
        </div>
      </div>

      
      {/* <div className="absolute top-72 left-16 z-50">
        <LeftSideAddBanner />
      </div> */}
      {/* Hero Section */}
      <div className="container mx-auto text-center">
        <div className="mb-6">
          <Crown className="h-20 w-20 text-yellow-500 mx-auto " />
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg transform "></div>
            <h1 className="relative text-4xl md:text-5xl font-bold text-red-700 mb-6">
              Our Glorious Heritage
            </h1>
          </div>
          <p className="text-lg text-red-600 max-w-4xl mx-auto leading-relaxed">
            From the divine lineage of Lord Ram to the mighty Mauryan Empire,
            discover the rich history and proud heritage of the Maurya community
            that spans over 2500 years
          </p>
        </div>

        {/* Heritage Cards Grid */}
        <div className="grid md:px-36 md:grid-cols-2 gap-8">
          {/* Mauryan Empire Card */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-600 relative overflow-hidden">
              <img
                src="https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754133157/Gemini_Generated_Image_pe53ibpe53ibpe53_ot4dkc.png"
                alt="Historical Monument"
                className="w-full h-full object-cover"
              />
              <Crown className="h-16 w-16 text-yellow-400 absolute top-6 left-6" />
            </div>
            <CardContent className="p-6 bg-yellow-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-red-700">
                  Treta Yuga - Lord Ram
                </h3>
                <Badge className="bg-yellow-200 text-yellow-800 border-yellow-300">
                  321-185 BCE
                </Badge>
              </div>
              <p className="text-gray-700 text-left">
                Our lineage traces back to Lord Ram, the seventh avatar of Lord
                Vishnu and the ideal king of Ayodhya. The divine connection that
                forms the foundation of our heritage.
              </p>
            </CardContent>
          </Card>

          {/* Mauryan Empire Card */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-600 relative overflow-hidden">
              <img
                src="https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754130857/chandragup_maur_vmo5vb.png"
                alt="Historical Monument"
                className="w-full h-full object-cover"
              />
              <Crown className="h-16 w-16 text-yellow-400 absolute top-6 left-6" />
            </div>
            <CardContent className="p-6 bg-yellow-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-red-700">
                  Mauryan Empire
                </h3>
                <Badge className="bg-yellow-200 text-yellow-800 border-yellow-300">
                  321-185 BCE
                </Badge>
              </div>
              <p className="text-gray-700 text-left">
                It was founded by Chandragupta Maurya, our ancestor who
                established one of the largest empires in ancient India,
                spanning from Afghanistan to Bengal.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-64 bg-gradient-to-br from-purple-400 to-indigo-600 relative overflow-hidden">
              <img
                src="https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754130857/samrat_ashoka_hekb0f.png"
                alt="Modern Architecture"
                className="w-full h-full object-cover"
              />
              <Crown className="h-16 w-16 text-yellow-400 absolute top-6 left-6" />
            </div>
            <CardContent className="p-6 bg-yellow-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-red-700">
                  Samrat Ashoka's Reign
                </h3>
                <Badge className="bg-yellow-200 text-yellow-800 border-yellow-300">
                  Present Day
                </Badge>
              </div>
              <p className="text-gray-700 text-left">
                The great Emperor Ashoka spread Buddhism and dharma across the
                subcontinent and beyond, leaving an indelible mark on world
                history.
              </p>
            </CardContent>
          </Card>

          {/* Modern Era Card */}
          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <div className="h-64 bg-gradient-to-br from-purple-400 to-indigo-600 relative overflow-hidden">
              <img
                src="https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754130857/mauras_kuswahas_rjabks.png"
                alt="Modern Architecture"
                className="w-full h-full object-cover"
              />
              <Crown className="h-16 w-16 text-yellow-400 absolute top-6 left-6" />
            </div>
            <CardContent className="p-6 bg-yellow-50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-red-700">Modern Era</h3>
                <Badge className="bg-yellow-200 text-yellow-800 border-yellow-300">
                  Present Day
                </Badge>
              </div>
              <p className="text-gray-700 text-left">
                Today, Mauryas and Kushwahas continue to contribute to society
                while preserving our rich cultural heritage and values.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* <VerticalAdBanner /> */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 w-full">
        <div className="relative">
          {ad ? (
            <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className="relative p-4 sm:p-6 md:p-8 text-center">
                <Image
                  src={ad.bannerImageUrl}
                  alt="Ad Banner"
                  width={900}
                  height={300}
                  className="mx-auto rounded-xl shadow-lg w-full h-auto max-h-[300px] object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="mx-auto relative w-full max-w-[900px] h-[200px] sm:h-[250px] md:h-[300px]">
              <div
                className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 
          border-4 border-amber-300 rounded-2xl shadow-2xl 
          overflow-hidden transform hover:scale-105 transition-transform duration-300
          w-full h-full"
              >
                <div className="relative p-4 sm:p-6 md:p-8 w-full h-full">
                  {/* Decorative Book Pages Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>

                  {/* Content */}
                  <div className="text-center relative z-10 flex flex-col justify-center items-center h-full">
                    <div
                      className="relative border-2 border-dashed border-amber-400 rounded-lg p-4 sm:p-6 md:p-8 
                bg-gradient-to-br from-amber-50 to-yellow-100"
                    >
                      <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-amber-800 mb-2 sm:mb-4">
                        Book Your Ad (4) <br />
                        <span className="text-sm sm:text-base">
                          Please select image size of (900x300 pixels)
                        </span>
                      </h3>

                      <div className="space-y-2 sm:space-y-4 relative">
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                          <Sparkles className="h-5 w-5 sm:h-8 sm:w-8 text-amber-500 animate-pulse" />
                        </div>
                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                          <Star className="h-5 w-5 sm:h-8 sm:w-8 text-amber-500 animate-pulse" />
                        </div>

                        <p className="text-xs sm:text-sm text-amber-600 mt-2">
                          Go to your dashboard to create and manage ads.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Borders */}
                  <div className="absolute inset-x-0 top-0 h-1 sm:h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
                  <div className="absolute inset-x-0 bottom-0 h-1 sm:h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sacred Knowledge Section */}
      <div className="bg-yellow-50 py-16 px-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg transform "></div>
              <h1 className="relative text-3xl md:text-4xl font-bold text-red-700 mb-6">
                Sacred Knowledge
              </h1>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Ramayana */}
            <div className="text-center bg-yellow-100 p-8 rounded-lg shadow-lg hover:shadow-yellow-200">
              <BookOpen className="h-16 w-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-700 mb-3">Ramayana</h3>
              <p className="text-gray-600">
                The epic tale of our divine ancestor Lord Ram
              </p>
            </div>

            {/* Arthashastra */}
            <div className="text-center bg-yellow-100 p-8 rounded-lg shadow-lg hover:shadow-yellow-200">
              <Scroll className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-700 mb-3">
                Arthashastra
              </h3>
              <p className="text-gray-600">
                Chanakya's wisdom that guided the Mauryan Empire
              </p>
            </div>

            {/* Edicts of Ashoka */}
            <div className="text-center bg-yellow-100 p-8 rounded-lg shadow-lg hover:shadow-yellow-200">
              <Crown className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-700 mb-3">
                Edicts of Ashoka
              </h3>
              <p className="text-gray-600">
                The dharmic principles that shaped civilization
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divine Lineage Section */}
      <div className="bg-yellow-50 py-16 px-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg transform "></div>
              <h1 className="relative text-3xl md:text-4xl font-bold text-red-700 mb-6">
                Our Divine Lineage
              </h1>
            </div>
            <p className="text-lg text-red-600">
              The sacred genealogy connecting us to the divine
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="space-y-8">
              {/* Lord Ram */}
              <div className="text-center">
                <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-red-700">
                  Lord Ram (Treta Yuga)
                </h3>
              </div>

              {/* Connecting Line */}
              <div className="flex justify-center">
                <div className="w-1 h-12 bg-yellow-400"></div>
              </div>

              {/* Ikshvaku Dynasty */}
              <div className="text-center">
                <Crown className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-red-700">
                  Ikshvaku Dynasty
                </h3>
              </div>

              {/* Connecting Line */}
              <div className="flex justify-center">
                <div className="w-1 h-12 bg-yellow-400"></div>
              </div>

              {/* Chandragupta Maurya */}
              <div className="text-center">
                <Crown className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-red-700">
                  Chandragupta Maurya (321 BCE)
                </h3>
              </div>

              {/* Connecting Line */}
              <div className="flex justify-center">
                <div className="w-1 h-12 bg-yellow-400"></div>
              </div>

              {/* Samrat Ashoka */}
              <div className="text-center">
                <Crown className="h-12 w-12 text-red-600 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-red-700">
                  Samrat Ashoka (268 BCE)
                </h3>
              </div>

              {/* Connecting Line */}
              <div className="flex justify-center">
                <div className="w-1 h-12 bg-yellow-400"></div>
              </div>

              {/* Modern Community */}
              <div className="text-center">
                <Crown className="h-12 w-12 text-red-800 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-red-700">
                  Modern Maurya/Kushwaha Community
                </h3>
              </div>
            </div>
          </div>

          {/* Core Values Section */}
        </div>
      </div>
      {/* Our core value section */}
      <div className=" bg-yellow-50 py-8 px-12">
        <div className=" mb-8 bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] text-white py-16 rounded-2xl container mx-auto px-4 ">
          <div className="container mx-auto px-4 ">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">धर्म (Dharma)</h3>
                <p className="text-orange-100">Righteousness and moral duty</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">अर्थ (Artha)</h3>
                <p className="text-orange-100">
                  Prosperity and material security
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">काम (Kama)</h3>
                <p className="text-orange-100">
                  Love and emotional fulfillment
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">मोक्ष (Moksha)</h3>
                <p className="text-orange-100">
                  Liberation and spiritual growth
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
