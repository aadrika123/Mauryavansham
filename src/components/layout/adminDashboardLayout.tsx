"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";
import {
  Crown,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  Calendar,
  Tv,
  Camera,
  Tv2,
  MessageSquare,
  Globe,
  Wallet2Icon,
  Search,
  Menu,
  X,
} from "lucide-react"; // ✅ Added Menu & X icons
import type { User as NextAuthUser } from "next-auth";
import { signOut } from "next-auth/react";

export default function AdmindashboardLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: NextAuthUser;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ Sidebar toggle state
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "superAdmin") {
      fetch("/api/admin/notifications")
        .then((res) => res.json())
        .then((data) => setNotifications(data));
    }
  }, [user]);

  // Sidebar items for regular admin
  const adminSidebarItems = [
    { title: "Home", href: "/", icon: LayoutDashboard },
    { title: "Dashboard", href: "/admin/overview", icon: LayoutDashboard },
    { title: "Manage Users", href: "/admin/users", icon: Users },
    { title: "Create Events", href: "/admin/events", icon: Calendar },
    { title: "Blog Moderation", href: "/admin/blogs", icon: Camera },
    { title: "My Matrimonial Profiles", href: "/admin/profile-list", icon: LayoutDashboard },
    { title: "Search Matrimonial Profiles", href: "/admin/search-profile", icon: Search },
    { title: "My Blog's", href: "/admin/my-blogs", icon: Camera },
    { title: "Book Ads", href: "/admin/book-ads", icon: Tv },
    { title: "Discussions Moderation", href: "/admin/discussions", icon: MessageSquare },
    { title: "Register-business", href: "/admin/register-business", icon: Wallet2Icon },
  ];

  const superAdminSidebarItems = [
    { title: "Home", href: "/", icon: LayoutDashboard },
    { title: "Dashboard", href: "/admin/overview", icon: LayoutDashboard },
    { title: "All Users", href: "/admin/manage-users", icon: Users },
    { title: "Ad Moderation", href: "/admin/ads", icon: Tv },
    { title: "Ads Rates", href: "/admin/ad-rates", icon: Tv2 },
    { title: "Ads Location Master", href: "/admin/ads-location-master", icon: Tv2 },
     { title: "Discussion Category Master", href: "/admin/discussion-castegory-master", icon: Globe },
    ...adminSidebarItems, // ✅ SuperAdmin gets all admin items + All Users
  ];

  const sidebarItems = user?.role === "superAdmin" ? superAdminSidebarItems : adminSidebarItems;

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut({ callbackUrl: "/", redirect: false });
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="bg-orange-50 min-h-screen">
      {/* Header */}
      <div className="bg-red-800 text-white p-4 fixed top-0 left-0 right-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* ✅ Hamburger menu for mobile */}
          <button
            className="lg:hidden p-2 rounded hover:bg-red-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Crown className="w-8 h-8 text-orange-400" />
          <div>
            <h1 className="text-2xl font-bold capitalize">
              Welcome back, {user?.name || ""} ({user?.role})
            </h1>
            <p className="text-red-200">Your matrimonial journey continues</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          {(user?.role === "admin" || user?.role === "superAdmin") && (
            <DropdownMenu
              onOpenChange={async (isOpen) => {
                if (isOpen) {
                  const unreadNotifications = notifications.filter((n) => n.isRead === 0);
                  if (unreadNotifications.length > 0) {
                    await fetch("/api/admin/notifications/mark-read", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        notificationIds: unreadNotifications.map((n) => n.id),
                      }),
                    });
                    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: 1 })));
                  }
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-red-700 relative"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  {notifications.filter((n) => n.isRead === 0).length > 0 && (
                    <span className="ml-2 bg-yellow-400 text-red-800 rounded-full px-2 text-xs">
                      {notifications.filter((n) => n.isRead === 0).length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>

              {notifications.length > 0 && (
                <DropdownMenuContent
                  align="end"
                  className="w-72 max-h-96 overflow-y-auto"
                >
                  {notifications.map((n) => (
                    <DropdownMenuItem
                      key={n.id}
                      className="whitespace-normal text-sm"
                    >
                      {n.message}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          )}

          {/* Account Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-red-700"
              >
                <Settings className="w-4 h-4 mr-2" /> Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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

      {/* Sidebar + Main Content */}
      <div className="pt-24 flex">
        {/* Sidebar */}
        <div
          className={cn(
            "bg-yellow-50 border-yellow-200 rounded-lg p-4 w-60 h-[calc(100vh-6rem)] flex flex-col fixed top-24 z-30 transform transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Profile section */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-14 h-14 rounded-full bg-gray-300 overflow-hidden shadow-md cursor-pointer"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "/admin/user-profile/" + user?.id;
                }
              }}
            >
              <img
                src={user?.photo || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-red-700">{user?.name}</h3>
              <p className="text-sm text-red-600">{user?.role}</p>
            </div>
          </div>

          {/* Scrollable nav */}
          <nav className="space-y-2 overflow-y-auto flex-1">
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
                onClick={() => setSidebarOpen(false)} // ✅ Close on mobile click
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 px-6">{children}</div>
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
