"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";
import {
  Crown,
  Bell,
  Settings,
  LogOut,
  User,
  LayoutDashboard,
  Users,
  Heart,
  ShoppingBag,
  Calendar,
  HandHeart,
  Trophy,
  Globe,
  MessageSquare,
  Search
} from "lucide-react";
import type { User as NextAuthUser } from "next-auth";
import { signOut } from "next-auth/react";

export default function DashboardLayout({ children, user }: { children: React.ReactNode, user: NextAuthUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const sidebarItems = [
    { title: "Home", href: "/", icon: LayoutDashboard },
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Create Matrimonial Profile", href: "/dashboard/create-profile", icon: LayoutDashboard },
    { title: "My Profiles", href: "/dashboard/profile-list", icon: LayoutDashboard },
    { title: "Search Profiles", href: "/dashboard/search-profile", icon: Search },

  ];

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut({ callbackUrl: "/", redirect: false });
    window.location.href = "/";
  };

  return (
    <div className="bg-orange-50 min-h-screen">
      {/* Header */}
      <div className="bg-red-800 text-white p-4 fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Crown className="w-8 h-8 text-orange-400" />
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name || ""}!</h1>
              <p className="text-red-200">Your matrimonial journey continues</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-white hover:bg-red-700">
              <Bell className="w-4 h-4 mr-2" /> Notifications
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white hover:bg-red-700">
                  <Settings className="w-4 h-4 mr-2" /> Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile/edit">
                    <User className="w-4 h-4 mr-2" /> Edit Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsOpen(true)}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content with sidebar */}
      <div className="pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="">
            <div className="bg-yellow-50 border-yellow-200 rounded-lg p-4 fixed top-24  w-60 h-[calc(100vh-6rem)] ">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-red-700">{user?.name}</h3>
                  <p className="text-sm text-red-600">{user?.email}</p>
                </div>
              </div>
              <nav className="space-y-2 h-screen">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-orange-100 text-orange-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 -ml-32 px-8">
            {children}
          </div>
        </div>
      </div>

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
    </div>
  );
}
