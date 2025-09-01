"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Trophy,
  CheckCircle,
  Share,
  User,
  Calendar,
  MapPin,
  Award,
  Star,
  Sparkles,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { LeftSideAddBanner } from "@/src/components/common/LeftSideAddBanner";
import { VerticalAdBanner } from "@/src/components/common/VerticalAdBanner";
import Image from "next/image";
interface Achievement {
  id: number;
  name: string;
  title: string;
  description: string;
  image: string;
  category:
    | "Healthcare"
    | "Sports"
    | "Technology"
    | "Education"
    | "Business"
    | "Arts";
  isVerified: boolean;
  isFeatured: boolean;
  isHallOfFame: boolean;
  year: number;
  location: string;
  keyAchievement: string;
  impact: string;
  achievements: string[];
}

interface AchievementsClientProps {
  initialAchievements?: Achievement[];
}
interface AdPlacement {
  id: number;
  bannerImageUrl: string;
  link?: string;
  views: number;
  placementId: number;
}

export default function AchievementsClient({
  initialAchievements,
}: AchievementsClientProps) {
  const [activeTab, setActiveTab] = useState("hall-of-fame");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
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
  const bottomAd = adPlacements.find((ad) => ad.placementId === 10);
  // console.log("Ad for AchievementsClient:", bottomAd);
  useEffect(() => {
    if (bottomAd)
      fetch(`/api/ad-placements/${bottomAd.id}`, { method: "POST" });
  }, [bottomAd]);

  // Real data with your provided names and images
  const realAchievements: Achievement[] = [
    {
      id: 1,
      name: "Savitri Kumari",
      title: "Healthcare Innovation Leader",
      description:
        "Leading healthcare initiatives and improving community health services with innovative approaches and dedication to patient care.",
      image:
        "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754129463/savitri_yjb8ku.jpg",
      category: "Healthcare",
      isVerified: true,
      isFeatured: true,
      isHallOfFame: false,
      year: 2024,
      location: "Ranchi, Jharkhand",
      keyAchievement:
        "Established mobile healthcare units serving 10,000+ rural patients",
      impact: "Improved healthcare access for underserved communities by 80%",
      achievements: [
        "Community Health Excellence Award",
        "Healthcare Innovation Prize",
      ],
    },
    {
      id: 2,
      name: "Prafful Priyadarshi",
      title: "Technology Entrepreneur",
      description:
        "Pioneering technology solutions and driving digital transformation in the region with cutting-edge innovations.",
      image:
        "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754129462/praful_rclc50.jpg",
      category: "Technology",
      isVerified: true,
      isFeatured: false,
      isHallOfFame: true,
      year: 2024,
      location: "Ranchi, Jharkhand",
      keyAchievement:
        "Developed AI-powered education platform used by 50,000+ students",
      impact:
        "Enhanced digital literacy and educational access across Jharkhand",
      achievements: ["Tech Innovation Award", "Digital Excellence Recognition"],
    },
    {
      id: 3,
      name: "Priyanka Bharti",
      title: "Education Reformer",
      description:
        "Transforming educational landscapes through innovative teaching methods and community engagement programs.",
      image:
        "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754129463/priyanka_wib5ox.jpg",
      category: "Education",
      isVerified: true,
      isFeatured: false,
      isHallOfFame: true,
      year: 2024,
      location: "Ranchi, Jharkhand",
      keyAchievement:
        "Established 25 community learning centers benefiting 5,000+ children",
      impact: "Increased literacy rates in rural areas by 60%",
      achievements: [
        "Education Excellence Award",
        "Community Development Prize",
      ],
    },
    {
      id: 4,
      name: "Rovin Kumar",
      title: "Sports Development Champion",
      description:
        "Promoting sports culture and developing athletic talent through comprehensive training programs and community initiatives.",
      image:
        "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754129463/rovin_dpvjsz.jpg",
      category: "Sports",
      isVerified: true,
      isFeatured: false,
      isHallOfFame: true,
      year: 2024,
      location: "Ranchi, Jharkhand",
      keyAchievement:
        "Trained 200+ young athletes, 15 reached state level competitions",
      impact: "Boosted sports participation among youth by 150%",
      achievements: [
        "Sports Excellence Award",
        "Youth Development Recognition",
      ],
    },
    {
      id: 5,
      name: "Vishwajeet Kumar",
      title: "Business Innovation Leader",
      description:
        "Driving economic growth through innovative business solutions and entrepreneurship development in the region.",
      image:
        "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754129463/vishwajeet_an8fcr.jpg",
      category: "Business",
      isVerified: true,
      isFeatured: false,
      isHallOfFame: true,
      year: 2024,
      location: "Ranchi, Jharkhand",
      keyAchievement: "Created 500+ jobs through startup ecosystem development",
      impact: "Contributed ₹50 crores to local economy growth",
      achievements: [
        "Business Excellence Award",
        "Entrepreneurship Recognition",
      ],
    },
    {
      id: 6,
      name: "Ankur Kumar",
      title: "Arts & Culture Promoter",
      description:
        "Preserving and promoting local arts and culture while creating platforms for artistic expression and cultural heritage.",
      image:
        "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754129463/ankur_dcoppo.jpg",
      category: "Arts",
      isVerified: true,
      isFeatured: false,
      isHallOfFame: true,
      year: 2024,
      location: "Ranchi, Jharkhand",
      keyAchievement: "Organized 50+ cultural events showcasing local talent",
      impact: "Revitalized local arts scene and cultural tourism",
      achievements: ["Cultural Excellence Award", "Arts Promotion Prize"],
    },
    {
      id: 7,
      name: "Aastha Rani",
      title: "Healthcare Community Worker",
      description:
        "Dedicated healthcare professional focusing on maternal and child health with exceptional community service record.",
      image:
        "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754129464/aastha_yzbjaa.jpg",
      category: "Healthcare",
      isVerified: true,
      isFeatured: false,
      isHallOfFame: true,
      year: 2024,
      location: "Ranchi, Jharkhand",
      keyAchievement: "Improved maternal health outcomes in 20 villages",
      impact: "Reduced maternal mortality rate by 40% in target areas",
      achievements: ["Community Health Award", "Maternal Care Excellence"],
    },
    {
      id: 8,
      name: "Dhirendra Kumar Singh",
      title: "Technology Solutions Architect",
      description:
        "Building robust technology infrastructure and digital solutions for local businesses and government initiatives.",
      image:
        "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754129463/dhirendra_pij6ma.jpg",
      category: "Technology",
      isVerified: true,
      isFeatured: false,
      isHallOfFame: true,
      year: 2024,
      location: "Ranchi, Jharkhand",
      keyAchievement: "Digitized 100+ local businesses with custom solutions",
      impact:
        "Increased operational efficiency by 70% for participating businesses",
      achievements: [
        "Digital Transformation Award",
        "Tech Innovation Recognition",
      ],
    },
    {
      id: 9,
      name: "Ujjawal Kumar",
      title: "Education Technology Specialist",
      description:
        "Integrating technology in education to enhance learning experiences and improve educational outcomes for students.",
      image:
        "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754129464/ujjawal_ds1yao.jpg",
      category: "Education",
      isVerified: true,
      isFeatured: false,
      isHallOfFame: true,
      year: 2024,
      location: "Ranchi, Jharkhand",
      keyAchievement: "Implemented e-learning systems in 30 schools",
      impact: "Enhanced learning outcomes for 8,000+ students",
      achievements: ["EdTech Excellence Award", "Innovation in Learning Prize"],
    },
    {
      id: 10,
      name: "Gautam Gaurav",
      title: "Community Sports Coordinator",
      description:
        "Organizing sports events and developing grassroots sports programs to identify and nurture local athletic talent.",
      image:
        "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754129464/gautam_ynholv.jpg",
      category: "Sports",
      isVerified: true,
      isFeatured: false,
      isHallOfFame: true,
      year: 2024,
      location: "Ranchi, Jharkhand",
      keyAchievement: "Organized 40+ inter-district sports tournaments",
      impact: "Discovered and developed 50+ promising athletes",
      achievements: ["Sports Organization Award", "Youth Development Prize"],
    },
    {
      id: 11,
      name: "Rakesh Kumar Verma",
      title: "Business Development Consultant",
      description:
        "Supporting local businesses through strategic consulting and helping establish sustainable business practices in the region.",
      image:
        "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754129465/rakesh_llnhl0.jpg",
      category: "Business",
      isVerified: true,
      isFeatured: false,
      isHallOfFame: true,
      year: 2024,
      location: "Ranchi, Jharkhand",
      keyAchievement: "Mentored 80+ small businesses to profitability",
      impact: "Generated ₹20 crores in additional revenue for local businesses",
      achievements: [
        "Business Mentorship Award",
        "Economic Development Recognition",
      ],
    },
    {
      id: 12,
      name: "Udai Kumar",
      title: "Cultural Heritage Preservationist",
      description:
        "Working to preserve and document local cultural heritage while promoting traditional arts and crafts among younger generations.",
      image:
        "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754129464/udai_eimlbe.jpg",
      category: "Arts",
      isVerified: true,
      isFeatured: false,
      isHallOfFame: true,
      year: 2024,
      location: "Ranchi, Jharkhand",
      keyAchievement: "Documented 100+ traditional art forms and practices",
      impact: "Preserved cultural heritage for future generations",
      achievements: [
        "Heritage Preservation Award",
        "Cultural Documentation Prize",
      ],
    },
  ];

  const [achievements] = useState(realAchievements);

  const featuredAchievement = achievements.find(
    (achievement) => achievement.isFeatured
  );
  const hallOfFameMembers = achievements.filter(
    (achievement) => achievement.isHallOfFame
  );
  const recentAchievements = achievements.filter(
    (achievement) => achievement.year === 2024
  );

  const filteredAchievements = achievements.filter((achievement) => {
    const matchesSearch =
      achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" ||
      achievement.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Healthcare":
        return "bg-pink-100 text-pink-800";
      case "Sports":
        return "bg-yellow-100 text-yellow-800";
      case "Technology":
        return "bg-blue-100 text-blue-800";
      case "Education":
        return "bg-green-100 text-green-800";
      case "Business":
        return "bg-purple-100 text-purple-800";
      case "Arts":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Healthcare":
        return "🏥";
      case "Sports":
        return "🏆";
      case "Technology":
        return "💻";
      case "Education":
        return "📚";
      case "Business":
        return "💼";
      case "Arts":
        return "🎨";
      default:
        return "⭐";
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center  text-gray-600 hover:text-red-700"
            >
              <ArrowLeft className="w-4 h-4 text-red-700" />
              <span className="text-red-700">Back to Home / </span>
            </Link>
            <h1 className="text-2xl font-bold text-red-700">
              Community Achievements
            </h1>
          </div>
          <Button className="bg-gradient-to-r bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nominate Achievement
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-[#FFF7ED] border-b border-yellow-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="arts">Arts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[#FFF7ED] border-b border-yellow-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab("hall-of-fame")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "hall-of-fame"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Hall of Fame
            </button>
            <button
              onClick={() => setActiveTab("recent")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "recent"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Recent Achievements
            </button>
            <button
              onClick={() => setActiveTab("by-category")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "by-category"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              By Category
            </button>
            <button
              onClick={() => setActiveTab("nominations")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "nominations"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Nominations
            </button>
          </div>
        </div>
      </div>
      {/* <div className="absolute top-72 left-16">
        <LeftSideAddBanner />
    </div> */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Featured Achievement */}
        {featuredAchievement && activeTab === "hall-of-fame" && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-red-700 mb-6">
              Featured Achievement
            </h2>
            <Card className="bg-yellow-50 border-yellow-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/3 p-6 flex justify-center items-center">
                    <img
                      src={featuredAchievement.image}
                      alt={featuredAchievement.name}
                      className="w-48 h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className="lg:w-2/3 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge
                        className={getCategoryColor(
                          featuredAchievement.category
                        )}
                      >
                        <span className="mr-1">
                          {getCategoryIcon(featuredAchievement.category)}
                        </span>
                        {featuredAchievement.category}
                      </Badge>
                      {featuredAchievement.isVerified && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-red-700 mb-2">
                      {featuredAchievement.name}
                    </h3>
                    <h4 className="text-lg font-semibold text-red-600 mb-4">
                      {featuredAchievement.title}
                    </h4>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {featuredAchievement.description}
                    </p>

                    <div className="mb-6">
                      <h5 className="font-semibold text-red-700 mb-2">
                        Key Achievement:
                      </h5>
                      <p className="text-gray-700">
                        {featuredAchievement.keyAchievement}
                      </p>
                    </div>

                    <div className="mb-6">
                      <p className="text-green-600 font-medium">
                        {featuredAchievement.impact}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 mb-6 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{featuredAchievement.year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{featuredAchievement.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        <span>Hall of Fame</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="bg-gradient-to-r bg-orange-600 hover:bg-orange-700 text-white">
                        <User className="w-4 h-4 mr-2" />
                        View Full Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share Achievement
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hall of Fame Members */}
        {activeTab === "hall-of-fame" && (
          <div>
            <h2 className="text-2xl font-bold text-red-700 mb-6">
              Hall of Fame Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hallOfFameMembers.map((achievement) => (
                <Card
                  key={achievement.id}
                  className="bg-yellow-50 hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="relative p-4">
                      <div className="flex justify-center mb-4">
                        <img
                          src={achievement.image}
                          alt={achievement.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge
                          className={getCategoryColor(achievement.category)}
                        >
                          <span className="mr-1">
                            {getCategoryIcon(achievement.category)}
                          </span>
                          {achievement.category}
                        </Badge>
                        {/* {achievement.isVerified && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )} */}
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <h3 className="text-lg font-bold text-red-700 mb-1 text-center">
                        {achievement.name}
                      </h3>
                      <h4 className="text-sm font-semibold text-purple-600 mb-3 text-center">
                        {achievement.title}
                      </h4>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {achievement.description}
                      </p>

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">
                          Achievement:
                        </p>
                        <p className="text-sm text-gray-700">
                          {achievement.keyAchievement}
                        </p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-green-600 font-medium">
                          {achievement.impact}
                        </p>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                        <span>
                          {achievement.year} • {achievement.location}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <Trophy className="w-4 h-4 mr-1" />
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-300 text-gray-700 bg-transparent"
                        >
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recent Achievements */}
        {activeTab === "recent" && (
          <div>
            <h2 className="text-2xl font-bold text-red-700 mb-6">
              Recent Achievements (2024)
            </h2>
            <div className="space-y-6">
              {recentAchievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className="bg-white hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={achievement.image}
                        alt={achievement.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-red-700">
                            {achievement.name}
                          </h3>
                          <Badge
                            className={getCategoryColor(achievement.category)}
                          >
                            <span className="mr-1">
                              {getCategoryIcon(achievement.category)}
                            </span>
                            {achievement.category}
                          </Badge>
                          {achievement.isVerified && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <h4 className="text-purple-600 font-semibold mb-2">
                          {achievement.title}
                        </h4>
                        <p className="text-gray-600 mb-3">
                          {achievement.description}
                        </p>
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Achievement:{" "}
                          </span>
                          <span className="text-sm text-gray-600">
                            {achievement.keyAchievement}
                          </span>
                        </div>
                        <p className="text-sm text-green-600 font-medium">
                          {achievement.impact}
                        </p>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>{achievement.year}</div>
                        <div>{achievement.location}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* By Category */}
        {activeTab === "by-category" && (
          <div>
            <h2 className="text-2xl font-bold text-red-700 mb-6">
              Achievements by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className="bg-white hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={achievement.image}
                        alt={achievement.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-700">
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-purple-600">
                          {achievement.title}
                        </p>
                      </div>
                      <Badge className={getCategoryColor(achievement.category)}>
                        {getCategoryIcon(achievement.category)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {achievement.description}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{achievement.year}</span>
                      <span>{achievement.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Nominations Placeholder */}
        {activeTab === "nominations" && (
          <Card className="p-8 text-center">
            <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Nominations
            </h3>
            <p className="text-gray-600 mb-4">
              Pending nominations and community suggestions will appear here
            </p>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Submit Nomination
            </Button>
          </Card>
        )}
      </div>
      <div className="mt-8 mb-10">
        {/* <VerticalAdBanner /> */}
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
                  <div className="absolute bottom-2 right-2 bg-black/30 text-white text-sm px-2 py-1 rounded">
                    {bottomAd.views} <Eye className="w-4 h-4 inline" />
                  </div>
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
                          Book Your Ad (10) <br />
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
