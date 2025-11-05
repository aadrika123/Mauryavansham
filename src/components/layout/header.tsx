"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Menu,
  Search,
  Users,
  Heart,
  Crown,
  LogOut,
  X,
  Calendar,
  HandHeart,
  Trophy,
  HeartHandshake,
  Landmark,
  House,
  User,
  ShoppingBag,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa6";

type HeaderProps = {
  profileData: any; // ideally type it properly
};
export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const userName = session?.user?.name || "User";
  const userDetails = session?.user;
  const userImage = profileData?.data?.profileImage || "/placeholder-user.jpg";
  const loginUser = session?.user;
  const [loading, setLoading] = useState(false);

  console.log(userImage, "authUser");
  console.log(profileData, "profileData");
  console.log(userDetails, "userDetails");

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      if (!loginUser?.id) return;

      try {
        const res = await fetch(`/api/users/getUserByid/${loginUser.id}`);
        const data = await res.json();

        if (res.ok) {
          setProfileData(data);
          setLoading(false);
        } else {
          // console.error("Failed to fetch profile:", data?.error);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [loginUser?.id]);

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

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* {loading && <Loader  height={20}/>} */}
      <header className="w-full">
        {/* Main Header */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-4">
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo + Mobile Menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden text-orange-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Link href="/" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-700 bg-clip-text text-transparent">
                    Mauryavansham
                  </h1>
                  <p className="text-md font-semibold text-red-700">
                    मौर्यवंश - गौरवशाली परंपरा
                  </p>
                </div>
              </Link>
            </div>

            {/* Search Bar (Desktop only) */}
            {/* <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search community members, discussions..."
                className="pl-10 bg-white border border-orange-500 focus:border-orange-500 focus:ring-0 focus:outline-none"
              />
            </div>
          </div> */}

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              {!isAuthenticated ? (
                <Button
                  variant="outline"
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  <Link href="/sign-in">Login</Link>
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  {/* Profile Image with Completion Circle */}
                  {/* Profile Image with Completion Circle */}
                  <div className="relative group flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <Link
                        href={
                          profileData?.data?.role === "admin" ||
                          profileData?.data?.role === "superAdmin"
                            ? `/admin/user-profile/${loginUser?.id}`
                            : `/dashboard/user-profile/${loginUser?.id}`
                        }
                      >
                        <div className="relative w-16 h-16 cursor-pointer">
                          {/* Circular progress ring */}
                          <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
                            <circle
                              className="text-gray-200"
                              strokeWidth="4"
                              stroke="currentColor"
                              fill="transparent"
                              r="28"
                              cx="32"
                              cy="32"
                            />
                            <circle
                              className="text-green-500"
                              strokeWidth="4"
                              strokeDasharray={2 * Math.PI * 28}
                              strokeDashoffset={
                                2 *
                                Math.PI *
                                28 *
                                (1 -
                                  (profileData?.profileCompletion || 0) / 100)
                              }
                              strokeLinecap="round"
                              stroke="url(#gradient)"
                              fill="transparent"
                              r="28"
                              cx="32"
                              cy="32"
                            />
                            {/* Gradient definition */}
                            <defs>
                              <linearGradient
                                id="gradient"
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

                          {/* User Image */}
                          {!loading ? (
                             <div className="w-14 h-14 rounded-full bg-gray-300 overflow-hidden shadow-md absolute top-1 left-1">
                              <img
                                src={
                                  profileData?.data?.photo || "/placeholder.svg"
                                }
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <p className=""><FaSpinner className="animate-spin w-4 h-4" /></p>
                           
                          )}
                        </div>
                      </Link>

                      {/* Percentage text below image */}
                      {profileData?.profileCompletion !== 100 && (
                        <span className="mt-1 text-xs font-bold text-orange-600">
                          {profileData?.profileCompletion || 0}%
                        </span>
                      )}
                    </div>

                    {/* Tooltip on hover */}
                    {profileData?.profileCompletion !== 100 && (
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded shadow-md">
                        Complete your profile for better experience
                      </div>
                    )}

                    {/* User Name */}
                    <span className="font-semibold text-lg text-orange-600">
                      <span className="font-medium italic">Hello,</span>{" "}
                      {userName}
                    </span>
                  </div>

                  {/* Sign Out Button */}
                  <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white flex items-center gap-2 py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out hover:scale-105"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              )}
              {isAuthenticated ? (
                userDetails?.role == "user" ? (
                  <Link href={`/dashboard`} passHref>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    >
                      <a>Main Panel</a>
                    </Button>
                  </Link>
                ) : userDetails?.role == "admin" ||
                  userDetails?.role == "superAdmin" ? (
                  <Link href={`/admin/overview`} passHref>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    >
                      <a>Admin Panel</a>
                    </Button>
                  </Link>
                ) : null
              ) : (
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Bar (Desktop) */}
        <nav className="bg-gradient-to-r from-red-800 to-red-900 px-4 hidden md:block">
          <div className="container mx-auto flex">
            {navigationItems.map((item) => {
              const isDisabled = item.href === "/" && item.title !== "Home"; // disable only when href="/" but NOT Home
              return (
                <Link
                  key={item.href + item.title}
                  href={isDisabled ? "#" : item.href}
                  className={`flex items-center  px-4 text-base py-6 gap-1  transition-colors 
            ${
              isDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "text-white hover:bg-red-700"
            }`}
                  onClick={(e) => {
                    if (isDisabled) e.preventDefault(); // block navigation
                  }}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Sidebar Menu */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex pointer-events-none">
            {/* Sidebar */}
            <div
              className={`sidebar bg-gradient-to-r from-orange-500 to-red-600 text-white 
    w-64 sm:w-80 md:w-96 lg:w-64 
    h-full shadow-lg p-4 space-y-4 
    transform transition-transform duration-300 ease-in-out 
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
    pointer-events-auto overflow-y-auto`}
            >
              {/* Top Section */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-white">Menu</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="text-white" />
                </button>
              </div>

              {/* 🔥 User Info (only if logged in) */}
              {isAuthenticated && (
                <div className="flex flex-col items-center text-center mb-4 border-b border-white/30 pb-4">
                  <div className="relative w-20 h-20">
                    {/* Circular progress ring */}
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

                    {/* User Image */}
                    <div className="w-18 h-18 rounded-full bg-gray-300 overflow-hidden shadow-md absolute top-1 left-1">
                      <img
                        src={profileData?.data?.photo || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Name + completion */}
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
                const isHome = item.title === "Home";
                const isDisabled = !isHome && item.href === "/";

                return (
                  <Link
                    key={item.href}
                    href={isDisabled ? "#" : item.href} // disabled items won't navigate
                    onClick={() => {
                      if (!isDisabled) setSidebarOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 text-white rounded transition-colors
          ${
            isDisabled ? "cursor-not-allowed opacity-60" : "hover:bg-orange-600"
          }`}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.title}
                  </Link>
                );
              })}

              {/* Auth Buttons */}
              <div className="pt-4 border-t border-white/30">
                {!isAuthenticated ? (
                  <>
                    <Link href="/sign-in" onClick={() => setSidebarOpen(false)}>
                      <Button className="bg-white text-red-600  w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setSidebarOpen(false)}>
                      <Button className="bg-white text-red-600  w-full mt-2">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Auth Buttons */}
                    <div className="pt-4 border-t border-white/30 space-y-2">
                      {!isAuthenticated ? (
                        <>
                          <Link
                            href="/sign-in"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <Button className="bg-white text-red-600 w-full">
                              Login
                            </Button>
                          </Link>
                          <Link
                            href="/sign-up"
                            onClick={() => setSidebarOpen(false)}
                          >
                            <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white w-full">
                              Sign Up
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          {/* ✅ Main Panel / Admin Panel */}
                          {userDetails?.role === "user" ? (
                            <Link
                              href={`/dashboard`}
                              passHref
                              onClick={() => setSidebarOpen(false)}
                            >
                              <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white w-full">
                                Main Panel
                              </Button>
                            </Link>
                          ) : userDetails?.role === "admin" ||
                            userDetails?.role === "superAdmin" ? (
                            <Link
                              href={`/admin/overview`}
                              passHref
                              onClick={() => setSidebarOpen(false)}
                            >
                              <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white w-full">
                                Admin Panel
                              </Button>
                            </Link>
                          ) : null}

                          {/* ✅ View Profile */}
                          {/* <Link
                            href={`/view-profile/${loginUser?.id}`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white w-full">
                              View Profile
                            </Button>
                          </Link> */}

                          {/* ✅ Sign Out */}
                          <Button
                            onClick={() => {
                              setSidebarOpen(false);
                              setIsOpen(true);
                            }}
                            className="w-full bg-white text-orange-500 hover:bg-gray-100"
                          >
                            Sign Out
                          </Button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Overlay */}
            <div
              className={`flex-1 transition-opacity duration-300 ease-in-out ${
                sidebarOpen
                  ? "bg-black bg-opacity-50 pointer-events-auto"
                  : "bg-transparent pointer-events-none"
              }`}
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Confirmation Modal */}
        {isOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-bold mb-4">
                Are you sure you want to sign out?
              </h2>
              <div className="flex justify-between space-x-4">
                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-gray-300 text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSignOut}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white"
                >
                  Yes, Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
