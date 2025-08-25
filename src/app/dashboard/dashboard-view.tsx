"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import {
  Heart,
  MessageCircle,
  Eye,
  Users,
  Crown,
  TrendingUp,
  Bell,
  Settings,
  Search,
  Star,
  User,
  LogOut,
  MapPin,
  Calendar,
  Sparkles,
  Gift,
  Clock,
  Filter,
  UserCheck,
  Zap,
  Camera,
  Tv,
  Plus,
  BookOpen,
  Award,
  HandHeart,
  HelpCircle,
  BarChart3,
  Megaphone,
  Edit3,
  DollarSign,
  Target
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Dashboard(props: any) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  
  const dashboardData = props?.profileList || []

  // Mock data for all features
  const stats = {
    // Matrimonial
    totalProfiles: dashboardData.length,
    interests: 7,
    messages: 12,
    profileViews: 45,
    
    // Blog
    totalBlogs: 8,
    blogViews: 234,
    blogLikes: 89,
    publishedBlogs: 6,
    
    // Ads
    activeAds: 3,
    adImpressions: 1250,
    adClicks: 67,
    adBudget: 5000,
    
    // Future features
    donations: 0,
    achievements: 0,
    helpRequests: 0
  }
const MotionCard = motion(Card)
  return (
    <div className="min-h-screen bg-gray-50 mb-10 shadow-lg rounded-md">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard</h1>
          <p className="text-gray-600">Manage your matrimonial profile, blogs, advertisements, and more all in one place.</p>
        </div>

        {/* Overview Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-xs">Matrimonial</p>
                  <p className="text-xl font-bold">{stats.totalProfiles}</p>
                </div>
                <Heart className="h-6 w-6 text-pink-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs">Blog Posts</p>
                  <p className="text-xl font-bold">{stats.totalBlogs}</p>
                </div>
                <Camera className="h-6 w-6 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs">Active Ads</p>
                  <p className="text-xl font-bold">{stats.activeAds}</p>
                </div>
                <Tv className="h-6 w-6 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-xs">Messages</p>
                  <p className="text-xl font-bold">{stats.messages}</p>
                </div>
                <MessageCircle className="h-6 w-6 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-xs">Donations</p>
                  <p className="text-xl font-bold">{stats.donations}</p>
                </div>
                <HandHeart className="h-6 w-6 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-xs">Achievements</p>
                  <p className="text-xl font-bold">{stats.achievements}</p>
                </div>
                <Award className="h-6 w-6 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </div> */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {[
            {
              title: "Matrimonial",
              value: stats.totalProfiles,
              icon: Heart,
              gradient: "from-rose-500 via-pink-500 to-pink-600",
            },
            {
              title: "Blog Posts",
              value: stats.totalBlogs,
              icon: Camera,
              gradient: "from-indigo-500 via-blue-500 to-cyan-500",
            },
            {
              title: "Active Ads",
              value: stats.activeAds,
              icon: Tv,
              gradient: "from-green-500 via-emerald-500 to-teal-500",
            },
            {
              title: "Messages",
              value: stats.messages,
              icon: MessageCircle,
              gradient: "from-yellow-500 via-amber-500 to-orange-500",
            },
            {
              title: "Donations",
              value: stats.donations,
              icon: HandHeart,
              gradient: "from-purple-500 via-violet-500 to-indigo-500",
            },
            {
              title: "Achievements",
              value: stats.achievements,
              icon: Award,
              gradient: "from-cyan-500 via-sky-500 to-blue-500",
            },
          ].map((stat, idx) => (
            <MotionCard
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`bg-gradient-to-br ${stat.gradient} text-white rounded-2xl shadow-lg border-0`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-80 tracking-wide">{stat.title}</p>
                    <p className="text-3xl font-extrabold">{stat.value}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <stat.icon className="h-7 w-7" />
                  </div>
                </div>
              </CardContent>
            </MotionCard>
          ))}
        </div>

        {/* Main Feature Sections */}
        <div className="space-y-8">
          {/* Matrimonial Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Heart className="mr-2 h-6 w-6 text-pink-600" />
              Matrimonial
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-pink-800 text-sm">Profile Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-pink-700">{stats.totalProfiles}</div>
                    <p className="text-pink-600 text-xs">total profiles</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    onClick={() => router.push("/dashboard/profile-list")}
                  >
                    <User className="mr-1 h-3 w-3" />
                    Manage
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-red-800 text-sm">Search Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-red-700">{stats.totalProfiles}</div>
                    <p className="text-red-600 text-xs">matches available</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => router.push("/dashboard/search-profile")}
                  >
                    <Search className="mr-1 h-3 w-3" />
                    Search
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-800 text-sm">Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-orange-700">{stats.interests}</div>
                    <p className="text-orange-600 text-xs">interested in you</p>
                  </div>
                  <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                    <Heart className="mr-1 h-3 w-3" />
                    View
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-purple-800 text-sm">Create Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-3">
                    <Plus className="h-8 w-8 text-purple-600 mx-auto mb-1" />
                    <p className="text-purple-600 text-xs">add new profile</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => router.push("/dashboard/create-profile")}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Create
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Blog Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Camera className="mr-2 h-6 w-6 text-blue-600" />
              My Blogs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-800 text-sm">Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-blue-700">{stats.totalBlogs}</div>
                    <p className="text-blue-600 text-xs">blog posts</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push("/dashboard/blogs")}
                  >
                    <BookOpen className="mr-1 h-3 w-3" />
                    View All
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-cyan-800 text-sm">Blog Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-cyan-700">{stats.blogViews}</div>
                    <p className="text-cyan-600 text-xs">total views</p>
                  </div>
                  <Button size="sm" className="w-full bg-cyan-600 hover:bg-cyan-700">
                    <Eye className="mr-1 h-3 w-3" />
                    Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-teal-800 text-sm">Likes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-teal-700">{stats.blogLikes}</div>
                    <p className="text-teal-600 text-xs">total likes</p>
                  </div>
                  <Button size="sm" className="w-full bg-teal-600 hover:bg-teal-700">
                    <Heart className="mr-1 h-3 w-3" />
                    Popular
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-emerald-800 text-sm">Create Blog</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-3">
                    <Edit3 className="h-8 w-8 text-emerald-600 mx-auto mb-1" />
                    <p className="text-emerald-600 text-xs">write new post</p>
                  </div>
                  <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700"
                   onClick={() => router.push("/dashboard/blogs")}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Write
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Advertisements Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Tv className="mr-2 h-6 w-6 text-green-600" />
              Advertisements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-800 text-sm">Active Ads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-green-700">{stats.activeAds}</div>
                    <p className="text-green-600 text-xs">running ads</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => router.push("/dashboard/ads")}
                  >
                    <Megaphone className="mr-1 h-3 w-3" />
                    Manage
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-lime-50 to-lime-100 border-lime-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lime-800 text-sm">Impressions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-lime-700">{stats.adImpressions}</div>
                    <p className="text-lime-600 text-xs">total views</p>
                  </div>
                  <Button size="sm" className="w-full bg-lime-600 hover:bg-lime-700">
                    <BarChart3 className="mr-1 h-3 w-3" />
                    Stats
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-yellow-800 text-sm">Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-yellow-700">{stats.adClicks}</div>
                    <p className="text-yellow-600 text-xs">total clicks</p>
                  </div>
                  <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700">
                    <Target className="mr-1 h-3 w-3" />
                    Performance
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-amber-800 text-sm">Book New Ad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-3">
                    <Plus className="h-8 w-8 text-amber-600 mx-auto mb-1" />
                    <p className="text-amber-600 text-xs">create campaign</p>
                  </div>
                  <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700"
                   onClick={() => router.push("/dashboard/ads")}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Book Ad
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Coming Soon Features */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 opacity-75">
                <CardHeader className="pb-3">
                  <CardTitle className="text-purple-800 flex items-center">
                    <HandHeart className="mr-2 h-5 w-5" />
                    Donations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-600 text-sm mb-3">Help others and make a difference in your community.</p>
                  <Button size="sm" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 opacity-75">
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-800 flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-600 text-sm mb-3">Track your milestones and earn badges for your activities.</p>
                  <Button size="sm" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 opacity-75">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-800 flex items-center">
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Help Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-600 text-sm mb-3">Get support and help from our community experts.</p>
                  <Button size="sm" className="w-full" disabled>
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 border-pink-200 hover:bg-pink-50"
              onClick={() => router.push("/dashboard/create-profile")}
            >
              <Plus className="h-5 w-5 text-pink-600" />
              <span className="text-xs">Add Profile</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 border-blue-200 hover:bg-blue-50"
              onClick={() => router.push("/dashboard/blogs")}
            >
              <Edit3 className="h-5 w-5 text-blue-600" />
              <span className="text-xs">Write Blog</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 border-green-200 hover:bg-green-50"
              onClick={() => router.push("/dashboard/ads")}
            >
              <Megaphone className="h-5 w-5 text-green-600" />
              <span className="text-xs">Book Ad</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 border-purple-200 hover:bg-purple-50"
              onClick={() => router.push("/dashboard/search-profile")}
            >
              <Search className="h-5 w-5 text-purple-600" />
              <span className="text-xs">Search</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 border-yellow-200 hover:bg-yellow-50"
            >
              <MessageCircle className="h-5 w-5 text-yellow-600" />
              <span className="text-xs">Messages</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 border-gray-200 hover:bg-gray-50"
            >
              <Settings className="h-5 w-5 text-gray-600" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}