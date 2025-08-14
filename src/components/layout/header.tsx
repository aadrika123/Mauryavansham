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
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

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
  const userImage = profileData?.data?.profileImage || "/placeholder-user.jpg";
  const loginUser = session?.user;

  console.log(userImage, "authUser");
  console.log(profileData, "profileData");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!loginUser?.id) return;

      try {
        const res = await fetch(`/api/profile/${loginUser.id}`);
        const data = await res.json();

        if (res.ok) {
          setProfileData(data);
        } else {
          console.error("Failed to fetch profile:", data?.error);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfileData();
  }, [loginUser?.id]);

  const navigationItems = [
    { title: "Home", href: "/", icon: House },
    { title: "Heritage", href: "/heritage", icon: Landmark },
    { title: "Community Forum", href: "/community", icon: Users },
    { title: "Matrimonial", href: "/matrimonial", icon: HeartHandshake },
    { title: "Events", href: "/events", icon: Calendar },
    { title: "Donation", href: "/donation", icon: HandHeart },
    { title: "Achievements", href: "/achievements", icon: Trophy },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-700 bg-clip-text text-transparent">
                  Mauryavansh
                </h1>
                <p className="text-md font-semibold text-red-700">
                  मौर्यवंश - गौरवशाली परंपरा
                </p>
              </div>
            </Link>
          </div>

          {/* Search Bar (Desktop only) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search community members, discussions..."
                className="pl-10 bg-white border border-orange-500 focus:border-orange-500 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

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
                {/* Profile Image and Name */}
                <div className="flex items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-gray-300 overflow-hidden shadow-md">
                    <img
                      src={userImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold text-lg text-orange-600 ">
                   <span className="font-medium italic"> Hello,</span> {userName}
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
              <Link href={`/dashboard`} passHref>
              {/* <Link href={`/view-profile/${loginUser?.id}`} passHref> */}
                <Button
                  asChild
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white"
                >
                  <a>Main Pannel</a>
                </Button>
              </Link>
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
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-6 py-4 text-white hover:bg-red-700 transition-colors font-medium"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.title}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex pointer-events-none">
          {/* Sidebar */}
          <div
            className={`bg-gradient-to-r from-orange-500 to-red-600 text-white w-64 h-full shadow-lg p-4 space-y-4 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } pointer-events-auto`}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-white">Menu</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="text-white" />
              </button>
            </div>

            {navigationItems
              .filter((item) => item.title !== "Home")
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-white hover:bg-orange-100 rounded"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.title}
                </Link>
              ))}

            <div className="pt-4 border-t">
              {!isAuthenticated ? (
                <>
                  <Link href="/sign-in" onClick={() => setSidebarOpen(false)}>
                    <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                      Login
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setSidebarOpen(false)}>
                    <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white mt-2">
                      Sign Up
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={`/view-profile/${loginUser?.id}`} passHref>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white"
                    >
                      <a>View Profile</a>
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setSidebarOpen(false);
                      setIsOpen(true);
                    }}
                    className="w-full mt-2 bg-white text-orange-500 hover:bg-gray-100"
                  >
                    Sign Out
                  </Button>
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
  );
}
