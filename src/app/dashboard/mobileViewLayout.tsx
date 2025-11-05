"use client";

import React, { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import {
  Crown,
  Menu,
  Globe,
  Heart,
  Calendar,
  Landmark,
  Users,
  X,
  LogOut,
  House,
  HeartHandshake,
  ShoppingBag,
  HandHeart,
  Trophy,
  Camera,
  Tv,
  BookAIcon,
  AmbulanceIcon,
  HeartHandshakeIcon,
  Wallet2Icon,
  MessageSquare,
  Tv2,
  Search,
  LayoutDashboard,
  User,
  Lock,
} from "lucide-react";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Toaster } from "@/src/components/ui/toaster";
import { useRouter, usePathname } from "next/navigation";
import "../../../styles/globals.css";
import { Footer } from "@/src/components/layout/footer";
import { Button } from "@/src/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { FaSpinner } from "react-icons/fa6";
import Translator from "@/src/hooks/googleTranslator";

const inter = Inter({ subsets: ["latin"] });

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrollY, setScrollY] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const loginUser = session?.user;
  const userDetails = session?.user;
  const userName = session?.user?.name || "User";
   const [showLoginModal, setShowLoginModal] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: Crown, label: "Home", path: "/" },
    { icon: Heart, label: "Matrimonial", path: "/matrimonial" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: Landmark, label: "Heritage", path: "/heritage" },
    { icon: Users, label: "Profile", path: "/profile" },
  ];

   const navigationItems = [
    { title: "Home", href: "/", icon: House },
    { title: "Heritage", href: "/heritage", icon: Landmark },
    { title: "Community Forum", href: "/community", icon: Users },
    { title: "Matrimonial", href: "/matrimonial", icon: HeartHandshake },
    { title: "Events & Calendar", href: "/events", icon: Calendar },
    { title: "Business Forum", href: "/business", icon: ShoppingBag },
    { title: "Health & Wellness", href: "/health-wellness", icon: HandHeart },
    { title: "Education", href: "/education", icon: Crown },
    { title: "Achievements", href: "/achievements", icon: Trophy },
    { title: "Blogs", href: "/blogs", icon: ShoppingBag },

  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // fetch profile info
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!loginUser?.id) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/users/getUserByid/${loginUser.id}`);
        const data = await res.json();
        if (res.ok) setProfileData(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [loginUser?.id]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        {/* ===== Mobile Header ===== */}
       

        {/* ===== Page Content ===== */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="pb-[70px] min-h-screen">{children}</div>
          <Toaster />
        </ThemeProvider>
        <div className="mb-16 -mt-20">
          <Footer />
        </div>

        {/* ===== Bottom Navigation ===== */}
       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 shadow-2xl z-40">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              const handleNavigation = () => {
                if (item.label === "Profile") {
                  if (!isAuthenticated) {
                    setShowLoginModal(true);
                    return;
                  }

                  if (userDetails?.role === "user") {
                    router.push(`/dashboard/user-profile/${userDetails?.id}`);
                  } else if (
                    userDetails?.role === "admin" ||
                    userDetails?.role === "superAdmin"
                  ) {
                    router.push(`/admin/user-profile/${userDetails?.id}`);
                  } else {
                    router.push("/profile");
                  }
                } else {
                  router.push(item.path);
                }
              };

              return (
                <button
                  key={item.label}
                  onClick={handleNavigation}
                  className="flex flex-col items-center gap-1 py-1 px-3 active:scale-95 transition-all"
                >
                  <div
                    className={`p-2 rounded-xl transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-orange-500"
                        : ""
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? "text-white" : "text-gray-600"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs ${
                      isActive ? "text-red-600 font-semibold" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== Sidebar Overlay ===== */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex pointer-events-none">
            {/* Sidebar */}
            <div
              className={`bg-gradient-to-r from-orange-500 to-red-600 text-white w-72 h-full shadow-lg p-4 space-y-4 transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } pointer-events-auto overflow-y-auto`}
            >
              {/* Top Section */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-white">Menu</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="text-white" />
                </button>
              </div>

              {/* User Info */}
              {isAuthenticated && (
                <div className="flex flex-col items-center text-center mb-4 border-b border-white/30 pb-4">
                  <div className="relative w-20 h-20">
                    <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
                      <circle
                        className="text-gray-200"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r="36"
                        cx="40"
                        cy="40"
                      />
                      <circle
                        className="text-green-500"
                        strokeWidth="4"
                        strokeDasharray={2 * Math.PI * 36}
                        strokeDashoffset={
                          2 *
                          Math.PI *
                          36 *
                          (1 - (profileData?.profileCompletion || 0) / 100)
                        }
                        strokeLinecap="round"
                        stroke="url(#gradientMobile)"
                        fill="transparent"
                        r="36"
                        cx="40"
                        cy="40"
                      />
                      <defs>
                        <linearGradient
                          id="gradientMobile"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="orange" />
                          <stop offset="100%" stopColor="green" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {!loading ? (
                      <div className="w-18 h-18 rounded-full bg-gray-300 overflow-hidden shadow-md absolute top-1 left-1">
                        <img
                          src={profileData?.data?.photo || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <FaSpinner className="animate-spin w-5 h-5 text-white absolute top-7 left-7" />
                    )}
                  </div>

                  <span className="mt-3 font-semibold text-lg">{userName}</span>
                  {profileData?.profileCompletion !== 100 && (
                    <span className="text-xs text-yellow-200 mt-1">
                      {profileData?.profileCompletion || 0}% Profile Complete
                    </span>
                  )}
                </div>
              )}

              {/* Navigation Items */}
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    onClick={() => {
                      router.push(item.href);
                      setSidebarOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-white rounded hover:bg-orange-600"
                  >
                    <Icon className="w-4 h-4" />
                    {item.title}
                  </button>
                );
              })}

              {/* Auth Buttons */}
              <div className="pt-4 border-t border-white/30 space-y-2">
                {!isAuthenticated ? (
                  <>
                    <Button
                      className="bg-white text-red-600 w-full"
                      onClick={() => {
                        router.push("/sign-in");
                        setSidebarOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      className="bg-white text-red-600 w-full"
                      onClick={() => {
                        router.push("/sign-up");
                        setSidebarOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <>
                    {userDetails?.role === "user" ? (
                      <Button
                        className="bg-gradient-to-r from-orange-500 to-red-600 text-white w-full"
                        onClick={() => {
                          router.push("/dashboard");
                          setSidebarOpen(false);
                        }}
                      >
                        Main Panel
                      </Button>
                    ) : userDetails?.role === "admin" ||
                      userDetails?.role === "superAdmin" ? (
                      <Button
                        className="bg-gradient-to-r from-orange-500 to-red-600 text-white w-full"
                        onClick={() => {
                          router.push("/admin/overview");
                          setSidebarOpen(false);
                        }}
                      >
                        Admin Panel
                      </Button>
                    ) : null}

                    <Button
                      onClick={() => {
                        setSidebarOpen(false);
                        handleSignOut();
                      }}
                      className="w-full bg-white text-orange-500 hover:bg-gray-100"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Overlay */}
            <div
              className="flex-1 bg-black bg-opacity-50 pointer-events-auto"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

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
                Please login to access your profile.
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
      </body>
    </html>
  );
}
