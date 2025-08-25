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
  Calendar,
  MapPin,
  Users,
  User,
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { LeftSideAddBanner } from "@/src/components/common/LeftSideAddBanner";
import { VerticalAdBanner } from "@/src/components/common/VerticalAdBanner";
import Image from "next/image";

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  organizer: string;
  type: "In-Person" | "Virtual" | "Hybrid";
  category: string;
  isFeatured: boolean;
}

interface EventsClientProps {
  initialEvents: Event[];
}
interface AdPlacement {
  id: number;
  bannerImageUrl: string;
  link?: string;
}
export default function EventsClient({ initialEvents }: EventsClientProps) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [events] = useState(initialEvents);

  const featuredEvent = events.find((event) => event.isFeatured);
  const regularEvents = events.filter((event) => !event.isFeatured);

  const filteredEvents = regularEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      event.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

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
  const bottomAd = adPlacements.find((ad) => ad.id === 8);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "In-Person":
        return "bg-green-100 text-green-800";
      case "Virtual":
        return "bg-blue-100 text-blue-800";
      case "Hybrid":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "In-Person":
        return "🟢";
      case "Virtual":
        return "🔵";
      case "Hybrid":
        return "🟣";
      default:
        return "⚪";
    }
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="flex items-center  text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 text-red-700" />
              <span className="text-red-700">Back to Home / </span>
            </Link>
            <h1 className="text-2xl font-bold text-red-700">
              Community Events
            </h1>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-[#FFF7ED] border-b border-yellow-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {/* <div className="absolute top-72 left-16 z-50">
        <LeftSideAddBanner />
    </div> */}
      {/* Navigation Tabs */}
      <div className="bg-[#FFF7ED] border-yellow-200 border-b ">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "upcoming"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "calendar"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setActiveTab("my-events")}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === "my-events"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              My Events
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Featured Event */}
        {featuredEvent && activeTab === "upcoming" && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-red-700 mb-6">
              Featured Event
            </h2>
            <Card className="bg-yellow-50 border-yellow-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/3">
                    <img
                      src={featuredEvent.image || "/placeholder.svg"}
                      alt={featuredEvent.title}
                      className="w-full h-64 lg:h-full object-cover"
                    />
                  </div>
                  <div className="lg:w-2/3 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm">
                        {getTypeIcon(featuredEvent.type)}
                      </span>
                      <Badge className={getTypeColor(featuredEvent.type)}>
                        {featuredEvent.type}
                      </Badge>
                    </div>

                    <h3 className="text-2xl font-bold text-red-700 mb-3">
                      {featuredEvent.title}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {featuredEvent.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(featuredEvent.date)} at{" "}
                          {featuredEvent.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{featuredEvent.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>
                          {featuredEvent.attendees}/{featuredEvent.maxAttendees}{" "}
                          attending
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>By {featuredEvent.organizer}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        Register Now
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-8 mb-12">
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
                            Book Your Ad (8) <br />
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
        {/* All Events */}
        <div>
          <h2 className="text-2xl font-bold text-red-700 mb-6">All Events</h2>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="bg-[#FEFCE8] hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={getTypeColor(event.type)}>
                          <span className="mr-1">
                            {getTypeIcon(event.type)}
                          </span>
                          {event.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-red-700 mb-2 line-clamp-2">
                        {event.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {formatDate(event.date)} at {event.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Users className="w-3 h-3" />
                          <span>
                            {event.attendees}/{event.maxAttendees} attending
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          Register
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-gray-300 text-yellow-700 bg-transparent"
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="space-y-3">
                <Calendar className="w-16 h-16 mx-auto text-gray-400" />
                <div>
                  <p className="text-gray-500 font-medium">No events found</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Try adjusting your search criteria or check back later for
                    new events.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Calendar View Placeholder */}
        {activeTab === "calendar" && (
          <Card className="p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Calendar View
            </h3>
            <p className="text-gray-600">
              Calendar view will be implemented here
            </p>
          </Card>
        )}

        {/* My Events Placeholder */}
        {activeTab === "my-events" && (
          <Card className="p-8 text-center">
            <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              My Events
            </h3>
            <p className="text-gray-600">
              Your registered and created events will appear here
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
