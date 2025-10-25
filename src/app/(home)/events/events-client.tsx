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
  Eye,
  Lock,
  X,
  Mic2Icon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { LeftSideAddBanner } from "@/src/components/common/LeftSideAddBanner";
import { VerticalAdBanner } from "@/src/components/common/VerticalAdBanner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/src/hooks/use-toast";

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
  views: number;
  placementId: number;
  link?: string;
  bannerImageUrl: string;
  isFeatured: boolean;
  toTime: string;
  fromTime: string;
  attendeesCount: number;
}

interface EventsClientProps {
  initialEvents: Event[];
}
interface AdPlacement {
  id: number;
  bannerImageUrl: string;
  link?: string;
  views: number;
  placementId: number;
  adUrl: string;
}
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  isActive: boolean;
  status: string;
  deactivationReason?: string;
  deactivatedReason?: string;
}

const HorizontalAdSlider: React.FC<{ ads: AdPlacement[] }> = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [ads.length]);

  useEffect(() => {
    if (ads[currentIndex]) {
      fetch(`/api/ad-placements/${ads[currentIndex].id}`, { method: "POST" });
    }
  }, [currentIndex, ads]);

  if (ads.length === 0) {
    return (
      <div className="mx-auto relative w-full max-w-[900px] h-[200px] sm:h-[250px] md:h-[300px]">
        <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl w-full h-full flex items-center justify-center text-center p-4">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-800">
              Book Your Ad (8)
            </h3>
            <span className="text-sm font-normal text-amber-700">
              Please select image size of (900x300 px)
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto relative w-full max-w-[900px]">
      <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative p-4 sm:p-8 text-center h-[200px] sm:h-[250px] md:h-[300px]">
          {ads.map((ad, index) => (
            <div
              key={ad.id}
              className={`absolute inset-0 p-4 sm:p-8 transition-opacity duration-1000 ${
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
                <Image
                  src={ad.bannerImageUrl}
                  alt={`Bottom Ad ${index + 1}`}
                  width={900}
                  height={300}
                  className="mx-auto rounded-xl shadow-lg w-full h-full object-contain"
                  priority={index === 0}
                />
              </a>
            </div>
          ))}

          {ads.length > 1 && (
            <>
              <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-20">
                {currentIndex + 1} / {ads.length}
              </div>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default function EventsClient({
  initialEvents,
  user,
}: EventsClientProps & { user: User | null }) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [events, setEvents] = useState(initialEvents);
  const { toast } = useToast();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const Router = useRouter();
  const [loadingEvents, setLoadingEvents] = useState<number[]>([]);
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [selectedEventAttendees, setSelectedEventAttendees] = useState<
    number[]
  >([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all upcoming featured events
  const upcomingFeaturedEvents = events
    .filter((ev) => {
      if (!ev.isFeatured) return false;
      const eventDate = new Date(ev.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

  // Get IDs of featured events to exclude from "All Events"
  const featuredEventIds = upcomingFeaturedEvents.map((ev) => ev.id);
  const allEvents = events.filter((ev) => !featuredEventIds.includes(ev.id));

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      event.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const pastEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate < today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

  const filteredPastEvents = pastEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      event.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);
  const bottomAds = adPlacements.filter((ad) => ad.placementId === 8);

  useEffect(() => {
    fetch("/api/ad-placements/approved")
      .then((res) => res.json())
      .then((data: AdPlacement[]) => {
        setAdPlacements(data);
      })
      .catch(() => console.error("Failed to load ad placements"));
  }, []);

  // useEffect(() => {
  //   if (bottomAds)
  //     fetch(`/api/ad-placements/${bottomAds.}`, { method: "POST" });
  // }, [bottomAds]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTimeTo12Hr = (time24: string) => {
    if (!time24) return "";
    const [hourStr, minStr] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = minStr;
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
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

  const handleRegister = async (event: Event) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (
      event.attendees >= event.maxAttendees ||
      loadingEvents.includes(event.id)
    )
      return;

    setLoadingEvents((prev) => [...prev, event.id]);

    try {
      const res = await fetch(`/api/events/${event.id}/attend`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === event.id ? { ...ev, attendees: ev.attendees + 1 } : ev
          )
        );
        toast({
          title: "✅ Success",
          variant: "default",
          description: data.message || "Registered successfully!",
        });
        window.location.reload();
      } else {
        toast({
          title: "❌ Error",
          variant: "destructive",
          description: data.error || "Failed to register",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "⚠️ Error",
        variant: "destructive",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoadingEvents((prev) => prev.filter((id) => id !== event.id));
    }
  };

  const nextFeatured = () => {
    setCurrentFeaturedIndex((prev) =>
      prev === upcomingFeaturedEvents.length - 1 ? 0 : prev + 1
    );
  };

  const prevFeatured = () => {
    setCurrentFeaturedIndex((prev) =>
      prev === 0 ? upcomingFeaturedEvents.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Login Required
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Please login to participate in community discussions and create
              new topics.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => Router.push("/sign-in")}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button
                onClick={() => setShowLoginModal(false)}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border-b border-gray-200 p-4">
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
        </div>
      </div>

      <div className="bg-yellow-50 border-b border-yellow-200 p-4">
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

      <div className="bg-yellow-50 border-yellow-200 border-b ">
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
              Past Events
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Featured Events Carousel */}
        {upcomingFeaturedEvents.length > 0 && activeTab === "upcoming" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-red-700">
                Featured Events{" "}
                {upcomingFeaturedEvents.length > 1 &&
                  `(${currentFeaturedIndex + 1}/${
                    upcomingFeaturedEvents.length
                  })`}
              </h2>
              {upcomingFeaturedEvents.length > 1 && (
                <div className="flex gap-2">
                  <Button
                    onClick={prevFeatured}
                    variant="outline"
                    size="sm"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={nextFeatured}
                    variant="outline"
                    size="sm"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <Card className="bg-yellow-50 border-yellow-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/3">
                    <Image
                      src={
                        upcomingFeaturedEvents[currentFeaturedIndex].image ||
                        "/placeholder.svg"
                      }
                      alt={"Event Banner"}
                      width={600}
                      height={500}
                      className="object-fill h-96"
                    />
                  </div>
                  <div className="lg:w-2/3 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm">
                        {getTypeIcon(
                          upcomingFeaturedEvents[currentFeaturedIndex].type
                        )}
                      </span>
                      <Badge
                        className={getTypeColor(
                          upcomingFeaturedEvents[currentFeaturedIndex].type
                        )}
                      >
                        {upcomingFeaturedEvents[currentFeaturedIndex].type}
                      </Badge>
                      <Badge className="bg-yellow-400 text-yellow-900">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>

                    <h3 className="text-2xl font-bold text-red-700 mb-3">
                      {upcomingFeaturedEvents[currentFeaturedIndex].title}
                    </h3>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {upcomingFeaturedEvents[currentFeaturedIndex].description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(
                            upcomingFeaturedEvents[currentFeaturedIndex].date
                          )}{" "}
                          at{" "}
                          {formatTimeTo12Hr(
                            upcomingFeaturedEvents[currentFeaturedIndex]
                              .fromTime
                          )}{" "}
                          to{" "}
                          {formatTimeTo12Hr(
                            upcomingFeaturedEvents[currentFeaturedIndex].toTime
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {
                            upcomingFeaturedEvents[currentFeaturedIndex]
                              .location
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>
                          {
                            upcomingFeaturedEvents[currentFeaturedIndex]
                              ?.attendeesCount
                          }
                          /
                          {
                            upcomingFeaturedEvents[currentFeaturedIndex]
                              .maxAttendees
                          }{" "}
                          attending
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>
                          By{" "}
                          {
                            upcomingFeaturedEvents[currentFeaturedIndex]
                              .organizer
                          }
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 mx-auto">
                      <Button
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() =>
                          handleRegister(
                            upcomingFeaturedEvents[currentFeaturedIndex]
                          )
                        }
                      >
                        Register
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-yellow-700 bg-transparent"
                        onClick={() => {
                          setSelectedEventAttendees(
                            upcomingFeaturedEvents[
                              currentFeaturedIndex
                            ].attendees?.map((a) => a.name)
                          );
                          setShowAttendeesModal(true);
                        }}
                      >
                        View Attendees
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carousel Dots Indicator */}
            {upcomingFeaturedEvents.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {upcomingFeaturedEvents.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeaturedIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentFeaturedIndex
                        ? "bg-orange-600 w-6"
                        : "bg-orange-300 hover:bg-orange-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "calendar" && (
          <div>
            <h2 className="text-xl font-bold text-red-700 mb-4">Past Events</h2>
            {filteredPastEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPastEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="bg-gray-50 hover:shadow-md transition-shadow overflow-hidden max-h-[420px] opacity-75"
                  >
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="relative w-full h-36 bg-gray-100 overflow-hidden">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt="Event Banner"
                          fill
                          className="object-contain w-full h-full grayscale"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className={getTypeColor(event.type)}>
                            <span className="mr-1">
                              {getTypeIcon(event.type)}
                            </span>
                            {event.type}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-gray-600 text-white">
                            Past Event
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-md font-semibold text-gray-700 mb-1 line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                            {event.description}
                          </p>

                          <div className="space-y-1 text-gray-400 text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {formatDate(event.date)} at{" "}
                                {formatTimeTo12Hr(event.fromTime)} to{" "}
                                {formatTimeTo12Hr(event.toTime)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>
                                {event.attendeesCount}/{event.maxAttendees}{" "}
                                attended
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-gray-300 text-gray-500 bg-transparent cursor-not-allowed"
                            disabled
                          >
                            Event Ended
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-gray-300 text-gray-600 bg-transparent"
                            onClick={() => {
                              setSelectedEventAttendees(
                                event.attendees?.map((a) => a.name) || []
                              );
                              setShowAttendeesModal(true);
                            }}
                          >
                            View Attendees
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <div className="space-y-2">
                  <Calendar className="w-12 h-12 mx-auto text-gray-400" />
                  <div>
                    <p className="text-gray-500 font-medium">
                      No past events found
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Past events will appear here once they have concluded.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
        {/* Add place */}
        <div className="mt-8 pb-12 px-4">
          <div className="container mx-auto">
            <HorizontalAdSlider ads={bottomAds} />
          </div>
        </div>

        {/* All Events */}
        <div>
          <h2 className="text-xl font-bold text-red-700 mb-4">All Events</h2>
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => {
                const isFull = event.attendees >= event.maxAttendees;
                const [loading, setLoading] = useState(false);

                const handleRegister = async () => {
                  if (!user) {
                    setShowLoginModal(true);
                    return;
                  }
                  if (isFull || loading) return;
                  setLoading(true);
                  try {
                    const res = await fetch(`/api/events/${event.id}/attend`, {
                      method: "POST",
                    });
                    const data = await res.json();

                    if (res.ok) {
                      setEvents((prev) =>
                        prev.map((ev) =>
                          ev.id === event.id
                            ? { ...ev, attendees: ev.attendees + 1 }
                            : ev
                        )
                      );
                      toast({
                        title: "✅ Success",
                        variant: "default",
                        description: data.message || "Registered successfully!",
                      });
                      window.location.reload();
                    } else {
                      toast({
                        title: "❌ Error",
                        variant: "destructive",
                        description: data.error || "Failed to register",
                      });
                    }
                  } catch (err) {
                    console.error(err);
                    toast({
                      title: "❌ Error",
                      variant: "destructive",
                      description: "Something went wrong",
                    });
                  } finally {
                    setLoading(false);
                  }
                };

                return (
                  <Card
                    key={event.id}
                    className="bg-[#FEFCE8] hover:shadow-md transition-shadow overflow-hidden max-h-[420px]"
                  >
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="relative w-full h-36 bg-gray-100 overflow-hidden">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt="Event Banner"
                          fill
                          className="object-contain w-full h-full"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className={getTypeColor(event.type)}>
                            <span className="mr-1">
                              {getTypeIcon(event.type)}
                            </span>
                            {event.type}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-md font-semibold text-red-700 mb-1 line-clamp-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {event.description}
                          </p>

                          <div className="space-y-1 text-gray-500 text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {formatDate(event.date)} at{" "}
                                {formatTimeTo12Hr(event.fromTime)} to{" "}
                                {formatTimeTo12Hr(event.toTime)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>
                                {event.attendeesCount}/{event.maxAttendees}{" "}
                                attending
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{event.organizer} </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            className={`flex-1 ${
                              isFull
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-orange-600 hover:bg-orange-700 text-white"
                            }`}
                            onClick={handleRegister}
                            disabled={isFull || loading}
                          >
                            {isFull
                              ? "Full"
                              : loading
                              ? "Registering..."
                              : "Register"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-gray-300 text-yellow-700 bg-transparent"
                            onClick={() => {
                              setSelectedEventAttendees(
                                event.attendees.map((a) => a.name)
                              );
                              setShowAttendeesModal(true);
                            }}
                          >
                            View Attendees
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <div className="space-y-2">
                <Calendar className="w-12 h-12 mx-auto text-gray-400" />
                <div>
                  <p className="text-gray-500 font-medium">No events found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search or check back later.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

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

      {showAttendeesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-700">Attendees</h3>
              <button
                onClick={() => setShowAttendeesModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {selectedEventAttendees.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {selectedEventAttendees.map((name, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-orange-50 border border-orange-200 rounded shadow-sm text-sm text-gray-700"
                  >
                    {name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No attendees yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
