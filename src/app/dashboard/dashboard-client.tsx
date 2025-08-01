"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Heart, MessageCircle, Eye, Users, Crown, TrendingUp, Bell, Settings, Search, Star, User, LogOut } from "lucide-react"
import Link from "next/link"
import type { User as NextAuthUser } from "next-auth"
import { Sidebar } from "@/src/components/layout/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"

interface DashboardClientProps {
  user: NextAuthUser
}

export default function DashboardClient({ user }: DashboardClientProps) {
  // Mock data - replace with real data from your API
  const dashboardStats = {
    profileViews: 45,
    interests: 12,
    messages: 8,
    matches: 3,
  }

  const recentActivities = [
    {
      id: 1,
      type: "view",
      message: "Priya Maurya viewed your profile",
      time: "2 hours ago",
      avatar: "PM",
    },
    {
      id: 2,
      type: "interest",
      message: "You received interest from Rohit Kushwaha",
      time: "5 hours ago",
      avatar: "RK",
    },
    {
      id: 3,
      type: "message",
      message: "New message from Anita Maurya",
      time: "1 day ago",
      avatar: "AM",
    },
  ]

  const suggestedProfiles = [
    {
      id: 1,
      name: "Kavya Maurya",
      age: 26,
      location: "Delhi",
      education: "MBA",
      occupation: "Marketing Manager",
      compatibility: 92,
      avatar: "KM",
    },
    {
      id: 2,
      name: "Ravi Kushwaha",
      age: 29,
      location: "Mumbai",
      education: "B.Tech",
      occupation: "Software Engineer",
      compatibility: 88,
      avatar: "RK",
    },
  ]

  return (
    <div className=" bg-orange-50">
      {/* Header */}
      <div className="bg-red-800 text-white p-4 fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Crown className="w-8 h-8 text-orange-400" />
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
              <p className="text-red-200">Your matrimonial journey continues</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-red-700">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-red-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile/edit">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className=" mx-auto p-6 mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-yellow-50 border-yellow-200 sticky top-6">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-700">{user.name}</h3>
                    <p className="text-sm text-red-600">{user.email}</p>
                  </div>
                </div>
              <Sidebar/>

              </CardHeader>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Profile Views</p>
                      <p className="text-2xl font-bold">{dashboardStats.profileViews}</p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-100 text-sm">Interests</p>
                      <p className="text-2xl font-bold">{dashboardStats.interests}</p>
                    </div>
                    <Heart className="w-8 h-8 text-pink-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Messages</p>
                      <p className="text-2xl font-bold">{dashboardStats.messages}</p>
                    </div>
                    <MessageCircle className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Matches</p>
                      <p className="text-2xl font-bold">{dashboardStats.matches}</p>
                    </div>
                    <Users className="w-8 h-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 bg-white rounded-lg border">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {activity.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{activity.message}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                      <div className="flex items-center">
                        {activity.type === "view" && <Eye className="w-4 h-4 text-blue-500" />}
                        {activity.type === "interest" && <Heart className="w-4 h-4 text-pink-500" />}
                        {activity.type === "message" && <MessageCircle className="w-4 h-4 text-green-500" />}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent">
                    View All Activities
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Profiles */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Suggested Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedProfiles.map((profile) => (
                    <div key={profile.id} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                          {profile.avatar}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{profile.name}</h4>
                          <p className="text-sm text-gray-600">
                            {profile.age} years • {profile.location}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">{profile.compatibility}% Match</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 mb-4">
                        <p>{profile.education}</p>
                        <p>{profile.occupation}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Link href={`/profile/${profile.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button size="sm" className="flex-1 bg-pink-600 hover:bg-pink-700">
                          <Heart className="w-4 h-4 mr-1" />
                          Interest
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    <Link href="/search-profile">
                      <Search className="w-4 h-4 mr-2" />
                      Explore More Profiles
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <Crown className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Complete Your Profile</h3>
                  <p className="mb-4 opacity-90">
                    Add more details to get better matches and increase your profile visibility
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button asChild className="bg-white text-orange-600 hover:bg-gray-100">
                      <Link href="/profile/edit">
                        <Search className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                    <Button asChild className="bg-white text-orange-600 hover:bg-gray-100">
                      <Link href="/upgrade">
                        <Search className="w-4 h-4 mr-2" />
                        Upgrade to Premium
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
