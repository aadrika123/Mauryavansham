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

export default function Dashboard(props: any) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  // Mock session data for demo
const dashboardData = props?.profileList

console.log(dashboardData)

  // Mock data for matrimonial matches
  const mockData = {
    nearbyMatches: 12,
    newMatches: 8,
    todayMatches: 5,
    preferredMatches: 15,
    profileViews: 24,
    interests: 0,
    messages: 0,
    premiumMatches: 0,
  }

  return (
    <div className="min-h-screen ">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">Todatl Profiles</p>
                  <p className="text-2xl font-bold">{dashboardData?.length}</p>
                </div>
                <User className="h-8 w-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Interests</p>
                  <p className="text-2xl font-bold">{mockData.interests}</p>
                </div>
                <Heart className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Messages</p>
                  <p className="text-2xl font-bold">{mockData.messages}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Premium</p>
                  <p className="text-2xl font-bold">{mockData.premiumMatches}</p>
                </div>
                <Crown className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* People Near Me */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-blue-800">
                <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                People Near Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-700 mb-1">{dashboardData.length}</div>
                <p className="text-blue-600 text-sm">matches within 10km</p>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push("/dashboard/search-profile")}>
                <Search className="mr-2 h-4 w-4" />
                Explore Nearby
              </Button>
            </CardContent>
          </Card>

          {/* Preferred Matches */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-green-800">
                <UserCheck className="mr-2 h-5 w-5 text-green-600" />
                Preferred Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-700 mb-1">{dashboardData.length}</div>
                <p className="text-green-600 text-sm">based on your preferences</p>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => router.push('/dashboard/search-profile')}
              >
                <Filter className="mr-2 h-4 w-4" />
                View Matches
              </Button>
            </CardContent>
          </Card>

          {/* New Matches */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-purple-800">
                <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
                New Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-purple-700 mb-1">{dashboardData.length}</div>
                <p className="text-purple-600 text-sm">fresh profiles added</p>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push('/dashboard/search-profile')}
              >
                <Zap className="mr-2 h-4 w-4" />
                See New Faces
              </Button>
            </CardContent>
          </Card>

          {/* Today's Matches */}
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-yellow-800">
                <Clock className="mr-2 h-5 w-5 text-yellow-600" />
                Today's Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-yellow-700 mb-1">{0}</div>
                <p className="text-yellow-600 text-sm">curated for today</p>
              </div>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700"
              disabled>
                <Calendar className="mr-2 h-4 w-4" />
                {/* View Today's */}
                Comming Soon
              </Button>
            </CardContent>
          </Card>

          {/* Premium Matches */}
          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-rose-800">
                <Crown className="mr-2 h-5 w-5 text-rose-600" />
                Premium Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-rose-700 mb-1">{mockData.premiumMatches}</div>
                <p className="text-rose-600 text-sm">verified premium profiles</p>
              </div>
              <Button className="w-full bg-rose-600 hover:bg-rose-700" disabled>
                <Star className="mr-2 h-4 w-4" />
                {/* Go Premium */}
                Comming Soon
              </Button>
            </CardContent>
          </Card>

          {/* More Matches */}
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-indigo-800">
                <Users className="mr-2 h-5 w-5 text-indigo-600" />
                Discover More
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-indigo-700 mb-1">500+</div>
                <p className="text-indigo-600 text-sm">profiles to explore</p>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={() => router.push('/dashboard/search-profile')}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Browse All
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 border-pink-200 hover:bg-pink-50 bg-transparent"
            >
              <Gift className="h-6 w-6 text-pink-600" />
              <span className="text-sm">Send Gift</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 border-blue-200 hover:bg-blue-50 bg-transparent"
            >
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Messages</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 border-green-200 hover:bg-green-50 bg-transparent"
              onClick={() => router.push("/dashboard/search-profile")}
            >
              <Search className="h-6 w-6 text-green-600" />
              <span className="text-sm">Advanced Search</span>
            </Button>

            <Button
              variant="outline"
              className="h-16 flex-col space-y-2 border-purple-200 hover:bg-purple-50 bg-transparent"
            >
              <Settings className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Preferences</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
