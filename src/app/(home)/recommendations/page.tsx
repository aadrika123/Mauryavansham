"use client"

import { useState, useEffect } from "react"
import { Sparkles, Users, Calendar, MessageSquare, TrendingUp, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { Avatar } from "@/src/components/ui/avatar"

interface RecommendedPerson {
  id: number
  name: string
  location: string
  commonConnections: number
  matchScore: number
  reason: string
  avatar: string | null
  isPremium?: boolean
  isVerified?: boolean
}

interface RecommendedEvent {
  id: number
  title: string
  date: string
  location: string
  attendees: number
  matchScore: number
  reason: string
  category: string
}

interface RecommendedContent {
  id: number
  title: string
  author: string
  type: string
  readTime: string
  matchScore: number
  reason: string
}

interface AIInsights {
  compatibilityScore: number
  newMatchesToday: number
  engagementPrediction: number
}

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState<"people" | "events" | "content">("people")

  const [recommendedPeople, setRecommendedPeople] = useState<RecommendedPerson[]>([])
  const [recommendedEvents, setRecommendedEvents] = useState<RecommendedEvent[]>([])
  const [recommendedContent, setRecommendedContent] = useState<RecommendedContent[]>([])
  const [insights, setInsights] = useState<AIInsights | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true)
      try {
        const [peopleRes, eventsRes, contentRes, insightsRes] = await Promise.all([
          fetch("/api/recommendations/people"),
          fetch("/api/recommendations/events"),
          fetch("/api/recommendations/content"),
          fetch("/api/recommendations/insights"),
        ])

        if (peopleRes.ok) {
          const peopleData = await peopleRes.json()
          setRecommendedPeople(peopleData)
        }

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json()
          setRecommendedEvents(eventsData)
        }

        if (contentRes.ok) {
          const contentData = await contentRes.json()
          setRecommendedContent(contentData)
        }

        if (insightsRes.ok) {
          const insightsData = await insightsRes.json()
          setInsights(insightsData)
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-red-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your personalized recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-yellow-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-red-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">AI-Powered Recommendations</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover people, events, and content tailored just for you based on your interests and activity
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={activeTab === "people" ? "default" : "outline"}
            onClick={() => setActiveTab("people")}
            className={activeTab === "people" ? "bg-red-600" : ""}
          >
            <Users className="w-4 h-4 mr-2" />
            People ({recommendedPeople.length})
          </Button>
          <Button
            variant={activeTab === "events" ? "default" : "outline"}
            onClick={() => setActiveTab("events")}
            className={activeTab === "events" ? "bg-red-600" : ""}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Events ({recommendedEvents.length})
          </Button>
          <Button
            variant={activeTab === "content" ? "default" : "outline"}
            onClick={() => setActiveTab("content")}
            className={activeTab === "content" ? "bg-red-600" : ""}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Content ({recommendedContent.length})
          </Button>
        </div>

        {/* People Recommendations */}
        {activeTab === "people" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedPeople.length > 0 ? (
              recommendedPeople.map((person) => (
                <Card key={person.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-16 h-16 bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                        {person.avatar ? (
                          <img
                            src={person.avatar || "/placeholder.svg"}
                            alt={person.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          person.name.substring(0, 2).toUpperCase()
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-gray-900 text-lg">{person.name}</h3>
                          <Badge className="bg-red-100 text-red-800">{person.matchScore}% Match</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{person.location}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Users className="w-4 h-4" />
                          {person.commonConnections} mutual connections
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">
                        <Sparkles className="w-4 h-4 inline mr-1 text-red-600" />
                        {person.reason}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-red-600 hover:bg-red-700">Connect</Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No people recommendations available at the moment.</p>
              </div>
            )}
          </div>
        )}

        {/* Events Recommendations */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedEvents.length > 0 ? (
              recommendedEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="bg-blue-100 text-blue-800">{event.category}</Badge>
                      <Badge className="bg-red-100 text-red-800">{event.matchScore}% Match</Badge>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3">{event.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {event.attendees} attending
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">
                        <Sparkles className="w-4 h-4 inline mr-1 text-blue-600" />
                        {event.reason}
                      </p>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Register Interest</Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No event recommendations available at the moment.</p>
              </div>
            )}
          </div>
        )}

        {/* Content Recommendations */}
        {activeTab === "content" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedContent.length > 0 ? (
              recommendedContent.map((content) => (
                <Card key={content.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="outline">{content.type}</Badge>
                      <Badge className="bg-red-100 text-red-800">{content.matchScore}% Match</Badge>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-3">{content.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      By {content.author} · {content.readTime} read
                    </p>
                    <div className="bg-green-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-700">
                        <TrendingUp className="w-4 h-4 inline mr-1 text-green-600" />
                        {content.reason}
                      </p>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      Read Now
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">No content recommendations available at the moment.</p>
              </div>
            )}
          </div>
        )}

        {/* AI Insights */}
        {insights && (
          <Card className="mt-12 bg-gradient-to-br from-red-100 to-blue-100 border-2 border-red-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-red-600" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl font-bold">
                    {insights.compatibilityScore}%
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Compatibility Score</h4>
                  <p className="text-sm text-gray-600">With recommended connections</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {insights.newMatchesToday}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">New Matches Today</h4>
                  <p className="text-sm text-gray-600">Based on recent activity</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold">
                    {insights.engagementPrediction}%
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Engagement Prediction</h4>
                  <p className="text-sm text-gray-600">For recommended content</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
