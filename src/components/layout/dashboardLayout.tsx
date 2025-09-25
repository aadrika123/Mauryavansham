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
  Search,
  Camera,
  Tv,
  Wallet2Icon,
  Menu,
  X,
  MessageSquare,
} from "lucide-react";
import type { User as NextAuthUser } from "next-auth";
import { signOut } from "next-auth/react";

export default function DashboardLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: NextAuthUser;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const pathname = usePathname();

  const sidebarItems = [
    { title: "Home", href: "/", icon: LayoutDashboard },
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      title: "My Inbox",
      href: "/dashboard/messenger-page",
      icon: MessageSquare,
    },
    {
      title: "Create Matrimonial Profile",
      href: "/dashboard/create-profile",
      icon: LayoutDashboard,
    },
    {
      title: "My Matrimonial Profiles",
      href: "/dashboard/profile-list",
      icon: LayoutDashboard,
    },
    {
      title: "Search Matrimonial Profiles",
      href: "/dashboard/search-profile",
      icon: Search,
    },
    { title: "My Blog's", href: "/dashboard/blogs", icon: Camera },
    { title: "Book Ads", href: "/dashboard/ads", icon: Tv },
    {
      title: "Register-business",
      href: "/dashboard/register-business",
      icon: Wallet2Icon,
    },
    {
      title: "My Registered-business",
      href: "/dashboard/view-business",
      icon: Wallet2Icon,
    },
  ];

  useEffect(() => {
    if (user?.role === "user") {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => setNotifications(data));
    }
  }, [user]);

  const handleNotificationsOpen = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length > 0) {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: unread.map((n) => n.id) }),
      });
      setNotifications((prev) =>
        prev.map((n) =>
          unread.find((u) => u.id === n.id) ? { ...n, isRead: true } : n
        )
      );
    }
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut({ callbackUrl: "/", redirect: false });
    window.location.href = "/";
  };

  return (
    <div className="bg-orange-50 min-h-screen">
      {/* Header */}
      <div className="bg-red-800 text-white p-4 lg:p-6  fixed top-0 left-0 right-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Hamburger (Mobile) */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-red-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
          <Crown className="w-8 h-8 text-orange-400" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              Welcome back, {user?.name || ""}!
            </h1>
            <p className="text-red-200 text-sm md:text-base hidden sm:block">
              {/* Your matrimonial journey continues */}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {user?.role === "user" && (
            <DropdownMenu onOpenChange={handleNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-red-700 relative"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  {notifications.filter((n) => !n.isRead).length > 0 && (
                    <span className="ml-2 bg-yellow-400 text-red-800 rounded-full px-2 text-xs">
                      {notifications.filter((n) => !n.isRead).length}
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
                    <div
                      key={n.id}
                      className="bg-yellow-50 rounded-md border border-yellow-200 p-2 mb-2 hover:bg-yellow-100 shadow-sm"
                    >
                      <DropdownMenuItem className="whitespace-normal text-sm">
                        {n.message}
                      </DropdownMenuItem>
                    </div>
                  ))}
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          )}

          {/* Desktop Settings Menu */}
          <div className="hidden lg:block">
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
      </div>

      {/* Sidebar + Main */}
      <div className="pt-24 flex">
        {/* Sidebar */}
        <div
          className={cn(
            "bg-yellow-50 -mt-3 border-yellow-200 rounded-lg p-4 w-64 h-[calc(100vh-6rem)] flex flex-col fixed top-24 z-30 transform transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Mobile Close Button */}
          {/* <div className="lg:hidden flex justify-end mb-4">
            <button
              className="p-2 rounded-md hover:bg-red-200"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6 text-red-700" />
            </button>
          </div> */}
          <div className="mb-2 border-b text-center flex flex-col items-center">
            {/* Profile Image */}
            <div
              className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden shadow-md cursor-pointer"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.href = "/dashboard/user-profile/" + user?.id;
                }
              }}
            >
              <img
                src={user?.photo || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name + Email */}
            <h3 className="mt-1 font-semibold text-red-700">{user?.name}</h3>
            <p className="text-xs text-red-600">{user?.email}</p>
          </div>

          <nav className="space-y-2 overflow-y-auto flex-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
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

            {/* Mobile-only Logout */}
            <div className="lg:hidden mt-6 border-t pt-4">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 w-full"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
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
