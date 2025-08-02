"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Menu, Search, Users, Heart, Crown, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import dummy from "@/public/placeholder-user.jpg"
import Image from "next/image"
export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image;

  const navigationItems = [
    { title: "Home", href: "/" },
    { title: "Heritage", href: "/heritage" },
    { title: "Community Forum", href: "/community", icon: Users },
    { title: "Matrimonial", href: "/matrimonial", icon: Heart },
    { title: "Events", href: "/events" },
    { title: "Donation", href: "/donation" },
    { title: "Achievements", href: "/achievements" },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="w-full">
      {/* Main Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-sans bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] text-transparent bg-clip-text">
                Mauryavansh
              </h1>
              <p className="text-sm text-red-700">मौर्यवंश - गौरवशाली परंपरा</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search community members, discussions..."
                className="pl-10 bg-white border border-orange-500 focus:border-orange-500 focus:ring-0 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <Button
                variant="outline"
                className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
              >
                <Link href="/sign-in">Login</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                {/* User Info */}
                <div className="flex items-center gap-2">


                  <Image src="/placeholder-user.jpg" alt="User" unoptimized />
                  <span className="font-medium text-orange-600">{userName}</span>
                </div>

                {/* Sign Out Button */}
                <Button
                  onClick={() => setIsOpen(true)} // Open the confirmation dialog
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}

            {isAuthenticated ? (
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Are you sure you want to sign out?</h2>
            <div className="flex justify-between space-x-4">
              <Button
                onClick={() => setIsOpen(false)} // Close the modal without signing out
                className="w-full bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSignOut} // Sign out and close the modal
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white"
              >
                Yes, Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-red-800 to-red-900 px-4">
        <div className="container mx-auto">
          <div className="hidden md:flex items-center">
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
        </div>
      </nav>
    </header>
  );
}
