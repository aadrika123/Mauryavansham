"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Calendar,
  BookOpen,
  Activity,
  Landmark,
  Menu,
  Bell,
  ChevronRight,
  Users,
  Star,
  Crown,
  Globe,
  Download,
  Phone,
  MapPin,
  Award,
  Lock,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { useToast } from "../ui/toastProvider";

interface CommunityStats {
  successfulMarriages: number;
  registeredFamilies: number;
  countriesConnected: number;
  forumDiscussions: number;
}
export default function MauryavanshamApp({
  children,
}: {
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [showAllServices, setShowAllServices] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const { addToast } = useToast();
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const res = await fetch("/api/upcoming-events");
        const data = await res.json();
        if (data.success) {
          setUpcomingEvents(data.data);
        }
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const slides = [
    {
      id: 1,
      title: "Find Your Perfect Match",
      subtitle: "Connect with verified Mauryavansham profiles",
      src: "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754133157/Gemini_Generated_Image_pe53ibpe53ibpe53_ot4dkc.png",
      alt: "Ancient Maurya Empire Art",
    },
    {
      id: 2,
      title: "Preserve Our Heritage",
      subtitle: "Explore rich cultural traditions",
      src: "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754130857/chandragup_maur_vmo5vb.png",
      alt: "Lord Ram Temple Ayodhya",
    },
    {
      id: 3,
      title: "Community Events",
      subtitle: "Join celebrations and gatherings",
      src: "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754130857/samrat_ashoka_hekb0f.png",
      alt: "Ashoka Pillar in Ancient India",
    },
    {
      id: 4,
      title: "Educational Resources",
      subtitle: "Learn about our history and culture",
      src: "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754130857/mauras_kuswahas_rjabks.png",
      alt: "Indian Family Celebration",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/masters");
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const mainCategories = [
    {
      id: "heritage",
      name: "Heritage",
      url: "/heritage",
      icon: Landmark,
      desc: "Explore our culture",
      count: "500+ Articles",
      gradient: "from-amber-600 to-yellow-500",
    },
    {
      id: "community",
      name: "Community Forum",
      url: "/community",
      icon: Globe,
      desc: "Connect with members",
      count: "10,000+ Posts",
      gradient: "from-amber-600 to-yellow-500",
    },
    {
      id: "matrimonial",
      name: "Matrimonial",
      url: "/matrimonial",
      icon: Heart,
      desc: "Find your life partner",
      count: "15,000+ Profiles",
      gradient: "from-red-600 to-orange-500",
    },
    {
      id: "events",
      name: "Events & Calendar",
      url: "/events",
      icon: Calendar,
      desc: "Community gatherings",
      count: "200+ Events",
      gradient: "from-orange-600 to-red-500",
    },
    {
      id: "business",
      name: "Business Forum",
      url: "/business",
      icon: Globe,
      desc: "Network & grow",
      count: "500+ Profiles",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      id: "wellness",
      name: "Health & Wellness",
      url: "/health-wellness",
      icon: Activity,
      desc: "Stay healthy",
      count: "50+ Programs",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      id: "education",
      name: "Education",
      url: "/education",
      icon: BookOpen,
      desc: "Learn and grow",
      count: "100+ Courses",
      gradient: "from-red-600 to-pink-500",
    },
    {
      id: "achievements",
      name: "Achievements",
      url: "/achievements",

      icon: Award,
      desc: "Our achievements",
      count: "50+ Awards",
      gradient: "from-red-600 to-pink-500",
    },
    {
      id: "blogs",
      name: "Blogs",
      url: "/blogs",

      icon: Download,
      desc: "Read our blogs",
      count: "50+ Blogs",
      gradient: "from-amber-600 to-yellow-500",
    },
    {
      id: "knowYourCommunity",
      name: "Know your community members",
      url: "/community-directory",
      icon: Users,
      desc: "Know your community members",
      count: "50+ Blogs",
      gradient: "from-amber-600 to-yellow-500",
    },
  ];

  const featuredProfiles = [
    { name: "Priya S.", age: 26, city: "Mumbai", verified: true },
    { name: "Rahul M.", age: 29, city: "Delhi", verified: true },
    { name: "Anjali K.", age: 25, city: "Bangalore", verified: true },
    { name: "Vikram P.", age: 31, city: "Pune", verified: true },
  ];

  const handleRegister = async (event: any) => {
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
        setUpcomingEvents((prev) =>
          prev.map((ev) =>
            ev.id === event.id ? { ...ev, attendees: ev.attendees + 1 } : ev
          )
        );

        addToast({
          title: "✅ Success",
          variant: "default",
          description: data.message || "Registered successfully!",
        });

        window.location.reload();
      } else {
        addToast({
          title: "❌ Error",
          variant: "destructive",
          description: data.error || "Failed to register",
        });
      }
    } catch (err) {
      console.error(err);
      addToast({
        title: "⚠️ Error",
        variant: "destructive",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoadingEvents((prev) => prev.filter((id) => id !== event.id));
    }
  };
  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrollY > 20
            ? "bg-white shadow-md"
            : "bg-gradient-to-r from-red-700 to-orange-600"
        }`}
      ></div>
      {/* Hero Slider */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-red-700 via-orange-600 to-yellow-500">
        <div className="relative h-full flex items-center justify-center px-6 text-center">
          <div className=" duration-500 ease-out">
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute  inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Background Image */}
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="w-full h-full object-fill"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-24 pt-4">
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-3 shadow-lg text-center border border-orange-100">
            <p className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              {loading
                ? "..."
                : `${stats?.registeredFamilies?.toLocaleString() || 0}+`}
            </p>
            <p className="text-xs text-gray-600 mt-1 leading-tight">
              Registered Families
            </p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-lg text-center border border-orange-100">
            <p className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              {loading
                ? "..."
                : `${stats?.successfulMarriages?.toLocaleString() || 0}+`}
            </p>
            <p className="text-xs text-gray-600 mt-1 leading-tight">
              Successful Marriages
            </p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-lg text-center border border-orange-100">
            <p className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              {loading
                ? "..."
                : `${stats?.countriesConnected?.toLocaleString() || 0}+`}
            </p>
            <p className="text-xs text-gray-600 mt-1 leading-tight">
              Countries Connected
            </p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-lg text-center border border-orange-100">
            <p className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              {loading
                ? "..."
                : `${stats?.forumDiscussions?.toLocaleString() || 0}+`}
            </p>
            <p className="text-xs text-gray-600 mt-1 leading-tight">
              Forum Discussions
            </p>
          </div>
        </div>

        {/* Main Categories */}
        {/* Main Categories */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Our Services</h2>
            <button
              onClick={() => setShowAllServices((prev) => !prev)}
              className="text-sm text-red-600 font-semibold flex items-center gap-1"
            >
              {showAllServices ? "View Less" : "View All"}{" "}
              <ChevronRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  showAllServices ? "rotate-90" : ""
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {(showAllServices
              ? mainCategories
              : mainCategories.slice(0, 4)
            ).map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => router.push(cat.url)} // ✅ Navigate on click
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 overflow-hidden border border-gray-100 text-left"
                >
                  <div className="flex items-center p-4 gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight">
                        {cat.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-tight line-clamp-2">
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Profiles */}
        {/* <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Featured Profiles
              </h2>
              <p className="text-sm text-gray-500">Verified & Active</p>
            </div>
            <button className="text-sm text-red-600 font-semibold">
              See All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {featuredProfiles.map((profile, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-all"
              >
                <div className="h-36 bg-gradient-to-br from-orange-400 to-red-400 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/50">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  {profile.verified && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 shadow-md">
                      <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-800 leading-tight">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-gray-600">{profile.age} years</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {profile.city}
                  </div>
                  <button className="mt-3 w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-2 rounded-lg text-sm font-semibold active:scale-95 transition-all">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Upcoming Events */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Upcoming Events
              </h2>
              <p className="text-sm text-gray-500">Join & Celebrate</p>
            </div>

            {/* 👇 Button sirf tab dikhega jab events > 4 ho */}
            {upcomingEvents.length > 4 && (
              <button className="text-sm text-red-600 font-semibold">
                View All
              </button>
            )}
          </div>

          <div className="space-y-3">
            {upcomingEvents.slice(0, 4).map((event, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex flex-col items-center justify-center text-white flex-shrink-0 shadow-md">
                    <span className="text-xs font-semibold">
                      {new Date(event.date.split(" ")[0]).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                        }
                      )}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {new Date(event.date.split(" ")[0]).getDate()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 leading-tight">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1 mt-1.5 text-sm text-gray-500">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-400 border-2 border-white"
                          ></div>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        {event.attendees}+ going
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={loadingEvents.includes(event.id)}
                    onClick={() => handleRegister(event)}
                    className={`mt-4 px-5 py-2 rounded-xl text-white shadow-md transition-transform ${
                      loadingEvents.includes(event.id)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-br from-red-600 to-orange-500 hover:scale-105"
                    }`}
                  >
                    {loadingEvents.includes(event.id) ? "Joining..." : "Join"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-br from-red-700 via-orange-600 to-yellow-500 rounded-3xl p-6 shadow-lg relative overflow-hidden mb-6">
          <div className="relative text-center">
            <Crown className="w-12 h-12 text-white mx-auto mb-3" />
            <h3 className="text-white font-bold text-xl mb-2 leading-tight">
              Join Mauryavansham Today!
            </h3>
            <p className="text-white/90 text-sm mb-5 leading-relaxed">
              Connect with your community, find your match, and celebrate our
              heritage together
            </p>
            <a
              href="tel:8862941658"
              className="bg-white text-red-700 px-8 py-3 rounded-full font-semibold shadow-xl active:scale-95 transition-all inline-flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Contact Us
            </a>
          </div>
        </div>
      </div>
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
              Please login to access this feature.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/sign-in")}
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
    </div>
  );
}
