"use client";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Tooltip } from "@/src/components/ui/tooltip"; // Assuming you have a tooltip component

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Users,
  Heart,
  ShoppingBag,
  Calendar,
  HandHeart,
  Trophy,
  Sparkles,
  Star,
  Eye,
  Crown,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useSession } from "next-auth/react";

interface User {
  id: number;
  name: string;
  photo: string | null;
}
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
export function FeaturesSection() {
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/ad-placements/approved")
      .then((res) => res.json())
      .then((data: AdPlacement[]) => {
        // sirf approved ads le lo
        setAdPlacements(data);
      })
      .catch(() => console.error("Failed to load ad placements"));
  }, []);

  const ad = adPlacements.find((ad) => ad.placementId === 3); // Assuming placement ID 3 is for the FeaturesSection ad

  useEffect(() => {
    if (ad) fetch(`/api/ad-placements/${ad.id}`, { method: "POST" });
  }, [ad]);

  const features = [
    {
      icon: Users,
      title: "Community Forum",
      description: "Connect with fellow Maurya community members worldwide",
      href: "/community",
    },
    {
      icon: Heart,
      title: "Matrimonial",
      description: "Find your perfect life partner within the community",
      href: "/matrimonial",
    },
    // {
    //   icon: ShoppingBag,
    //   title: "Trading Platform",
    //   description: "Buy and sell products/services within the community",
    //   href: "/",
    // },
    {
      title: "Business Forum  ",
      icon: ShoppingBag,
      description: "Promote your business and connect with potential clients",
      href: "/business",
    },
    {
      icon: Calendar,
      title: "Events & Calendar",
      description: "Stay updated with community events and celebrations",
      href: "/events",
    },

    {
      icon: HandHeart,
      title: "Donation",
      description: "Get help or offer assistance to community members",
      href: "/",
    },
    {
      icon: Trophy,
      title: "Achievements",
      description: "Showcase and celebrate community achievements",
      href: "/",
    },
    {
      icon: Sparkles,
      title: "Blogs",
      description: "Read and share articles on community topics",
      href: "/blogs",
    },
    {
      icon: Sparkles,
      title: "Educations",
      description: "Explore educational resources and opportunities",
      href: "/",
    },
    {
      icon: Eye,
      title: "Know your community members",
      description: "See who is available in the community",
      href: "/community-directory",
    },
  ];

  return (
    <>
      {/* Welcome Section */}
      <section className="py-8 bg-[#FFFDEF] px-4 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#8B0000] mb-6">
            Welcome to Mauryavansham.com
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed text-justify">
            MauryaVansham.com is an{" "}
            <strong>exclusive community platform</strong> created by and for
            members of the{" "}
            <strong>Kushwaha / Koiri / Maurya / Sakhya / Sainy</strong>{" "}
            community. Designed, developed, maintained and hosted by{" "}
            <strong>Aadrika Enterprises</strong>, whose Promoters proudly belong
            to the same community, this portal has been built with a{" "}
            <strong>pure motive of community development and unity</strong> –
            not for profit, but for growth, support, and heritage preservation.
          </p>

          <div className="text-justify space-y-3">
            {[
              "Connect with fellow community members across cities and states",
              "Explore the Community Directory and discover businesses, professionals, and families",
              "Find and share opportunities through our Business & Matrimonial sections",
              "Showcase achievements, preserve family lineage, and strengthen cultural bonds",
              "Support and grow together through peer-to-peer collaboration",
            ].map((point, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-yellow-600 text-xl">
                  <Crown />
                </span>
                <p className="text-gray-700">{point}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-lg font-medium text-[#8B4513] text-justify">
            Together, let us build a stronger, more connected, and empowered
            Maurya Vansh community.
          </p>
        </div>
      </section>

      <section className="py-10 bg-[#FFFDEF] px-4 sm:px-8">
        <div className="container mx-auto px-4 sm:px-8 py-2 w-full md:w-5/6">
          <div className="relative">
            {ad ? (
              <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 w-full max-w-[900px] mx-auto">
                <div className="relative p-4 sm:p-6 md:p-8 text-center">
                  <Image
                    src={ad.bannerImageUrl}
                    alt="Ad Banner"
                    width={900}
                    height={300}
                    className="w-full h-auto rounded-xl shadow-lg object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="mx-auto relative w-full max-w-[900px] h-[180px] sm:h-[220px] md:h-[300px]">
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
                  bg-gradient-to-br from-amber-50 to-yellow-100 w-full"
                      >
                        <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-amber-800 mb-4">
                          Book Your Ad (3) <br />
                          <p className="text-xs sm:text-sm">
                            (Recommended size: 900x300px)
                          </p>
                        </h3>

                        <div className="space-y-4 relative">
                          <div className="absolute top-4 left-4">
                            <Sparkles className="h-5 sm:h-6 md:h-8 w-5 sm:w-6 md:w-8 text-amber-500 animate-pulse" />
                          </div>
                          <div className="absolute top-4 right-4">
                            <Star className="h-5 sm:h-6 md:h-8 w-5 sm:w-6 md:w-8 text-amber-500 animate-pulse" />
                          </div>

                          <p className="text-xs sm:text-sm text-amber-600 mt-2">
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

        {/* Community Section */}
        <div className="container mx-auto px-4 mt-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#8B0000]">
              Community Services
            </h2>
            <p className="text-[#8B4513] max-w-2xl mx-auto">
              Strengthening our Maurya community through digital connectivity,
              preserving our heritage, and fostering meaningful relationships
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const isCommunityDirectory =
                feature.href === "/community-directory";
              const isDisabled =
                feature.href === "/" || (isCommunityDirectory && !session);

              return (
                <Card
                  key={index}
                  className="hover:shadow-[#ffd500] hover:shadow-lg bg-[#FFF8DE] border border-[#FFF6D5]"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <feature.icon className="h-6 w-6 text-orange-600" />
                      </div>
                      <CardTitle className="text-lg text-[#8B0000]">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {feature.description}
                    </CardDescription>
                    <div className="flex flex-col items-start gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className={
                          isDisabled
                            ? "cursor-not-allowed text-gray-400"
                            : "text-orange-600"
                        }
                        disabled={isDisabled}
                      >
                        <Link href={isDisabled ? "#" : feature.href}>
                          {feature.href === "/" ? "Coming Soon" : "Learn More"}
                        </Link>
                      </Button>
                      {/* Hover text for login */}
                      {isCommunityDirectory && !session && (
                        <span className="text-xs text-red-600 mt-1">
                          Please login first
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        {/* {session && ( */}

        {/* )} */}
      </section>
    </>
  );
}
