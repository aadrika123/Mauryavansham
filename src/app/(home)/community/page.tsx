"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  ArrowLeft,
  Crown,
  Plus,
  MessageCircle,
  Heart,
  Search,
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { LeftSideAddBanner } from "@/src/components/common/LeftSideAddBanner";
import { VerticalAdBanner } from "@/src/components/common/VerticalAdBanner";
import Image from "next/image";

interface Ad {
  id: number;
  title: string;
  bannerImageUrl: string;
  link?: string;
}
export default function CommunityForumPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Discussions");
  const [searchQuery, setSearchQuery] = useState("");

  const [adPlacements, setAdPlacements] = useState<Ad[]>([]);
  useEffect(() => {
    fetch("/api/ad-placements/approved")
      .then((res) => res.json())
      .then((data: Ad[]) => {
        setAdPlacements(data);
      })
      .catch(() => console.error("Failed to load ad placements"));
  }, []);
  const ad = adPlacements.find((ad) => ad.id === 3); // Assuming placement ID 3 is for the FeaturesSection ad
  const categories = [
    { name: "All Discussions", count: 156 },
    { name: "Business Help", count: 23 },
    { name: "Community Connect", count: 45 },
    { name: "Culture & Traditions", count: 32 },
    { name: "Education", count: 28 },
    { name: "Matrimonial Advice", count: 19 },
    { name: "Health & Wellness", count: 15 },
  ];

  const discussions = [
    {
      id: 1,
      title: "Help needed for starting a new business in Mumbai",
      author: "Rajesh Maurya",
      location: "Mumbai, Maharashtra",
      timeAgo: "2 hours ago",
      replies: 12,
      likes: 8,
      category: "Business Help",
    },
    {
      id: 2,
      title: "Looking for Maurya families in Toronto, Canada",
      author: "Priya Kushwaha",
      location: "Toronto, Canada",
      timeAgo: "5 hours ago",
      replies: 6,
      likes: 15,
      category: "Community Connect",
    },
    {
      id: 3,
      title: "Traditional Maurya wedding customs and rituals",
      author: "Pandit Vikram Maurya",
      location: "Varanasi, UP",
      timeAgo: "1 day ago",
      replies: 24,
      likes: 32,
      category: "Culture & Traditions",
    },
    {
      id: 4,
      title: "Educational scholarships for Maurya students",
      author: "Dr. Anjali Maurya",
      location: "Delhi",
      timeAgo: "2 days ago",
      replies: 18,
      likes: 28,
      category: "Education",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Business Help": "bg-blue-100 text-blue-800 border-blue-200",
      "Community Connect": "bg-green-100 text-green-800 border-green-200",
      "Culture & Traditions": "bg-purple-100 text-purple-800 border-purple-200",
      Education: "bg-orange-100 text-orange-800 border-orange-200",
      "Matrimonial Advice": "bg-pink-100 text-pink-800 border-pink-200",
      "Health & Wellness": "bg-teal-100 text-teal-800 border-teal-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  return (
    <div className="px-12 min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Breadcrumb Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>
          <span>/</span>
          <span>Community Forum</span>
        </div>
      </div>
      {/* <div className="absolute top-72 left-16 z-50">
        <LeftSideAddBanner />
    </div> */}
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8 text-center">
        <Crown className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg transform "></div>
          <h1 className="relative text-3xl md:text-4xl font-bold text-red-700">
            Community Forum
          </h1>
        </div>
        <p className="text-lg text-red-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Connect, share, and help each other in our supportive Maurya community
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {/* New Discussion Button */}
            <Card className="mb-6 bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3 text-red-700">
                  <Plus className="h-4 w-4" />
                  <span className="font-semibold">New Discussion</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                  Start Discussion
                </Button>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h3 className="font-bold text-red-700 mb-4">Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category.name
                          ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                          : "text-red-700 hover:bg-orange-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {category.name}
                        </span>
                        <span className="text-xs opacity-75">
                          ({category.count})
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 ">
            {/* Search Bar */}
            <div className="mb-6 ">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-300 focus:border-red-500"
                />
              </div>
            </div>

            {/* Discussion Threads */}
            <div className="space-y-4">
              {discussions.map((discussion) => (
                <Card
                  key={discussion.id}
                  className="bg-yellow-50 border-yellow-200 hover:shadow-md transition-shadow hover:shadow-yellow-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-red-700 mb-2 hover:text-red-800 cursor-pointer">
                          {discussion.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <span className="font-medium text-red-600">
                            {discussion.author}
                          </span>
                          <span>•</span>
                          <span>{discussion.location}</span>
                          <span>•</span>
                          <span>{discussion.timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{discussion.replies} replies</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{discussion.likes} likes</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={`${getCategoryColor(
                          discussion.category
                        )} ml-4`}
                      >
                        {discussion.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8 ">
              <Button
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent px-8 "
              >
                Load More Discussions
              </Button>
            </div>

            <div className="mt-12"></div>
            <div className="container mx-auto px-8 py-2 w-5/6">
              <div className="relative">
                {ad ? (
                  <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <div className="relative p-8 text-center">
                      {/* <h3 className="text-xl md:text-3xl font-bold text-amber-800 mb-4">
                        {ad.title}
                      </h3> */}
                      {/* <a
                        href={ad.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      > */}
                        <Image
                          src={ad.bannerImageUrl}
                          alt={ad.title}
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
                              Book Your Ad (5) <br />
                              <p>
                                Please select image size of (900x300 pixels)
                              </p>
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
      </div>
    </div>
  );
}
