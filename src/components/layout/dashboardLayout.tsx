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
  HeartHandshakeIcon,
  ChevronUp,
  ChevronDown,
  BookAIcon,
  AmbulanceIcon,
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
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  // unread notifications filter
  const unreadNotifications = notifications.filter(
    (n) => !n.isRead || n.isRead === 0
  );
  const unreadCount = unreadNotifications.length;

  const sidebarItems = [
    { title: "Home", href: "/", icon: LayoutDashboard },
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      title: "My Inbox",
      href: "/dashboard/messenger-page",
      icon: MessageSquare,
    },
    {
      title: "Matrimonial",
      href: "",
      icon: HeartHandshakeIcon,
      subItems: [
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
      ],
    },
    // {
    //   title: "Create Matrimonial Profile",
    //   href: "/dashboard/create-profile",
    //   icon: LayoutDashboard,
    // },
    // {
    //   title: "My Matrimonial Profiles",
    //   href: "/dashboard/profile-list",
    //   icon: LayoutDashboard,
    // },
    // {
    //   title: "Search Matrimonial Profiles",
    //   href: "/dashboard/search-profile",
    //   icon: Search,
    // },
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
    {
      title: "Education & Coaching",
      href: "",
      icon: BookAIcon,
      subItems: [
        {
          title: "Register Coaching",
          href: "/dashboard/register-coaching",
          icon: BookAIcon,
        },
        {
          title: "My Registered Coaching",
          href: "/dashboard/register-coaching/view",
          icon: BookAIcon,
        },
      ],
    },
    {
      title: "Health & Wellness",
      href: "",
      icon: AmbulanceIcon,
      subItems: [
        {
          title: "Register Health Service",
          href: "/dashboard/health-wellness",
          icon: BookAIcon,
        },
        {
          title: "My Registered Health Services",
          href: "/dashboard/health-wellness/view",
          icon: BookAIcon,
        },
      ],
    },
  ];

  useEffect(() => {
    if (user?.role === "user") {
      fetch("/api/admin/notifications")
        .then((res) => res.json())
        .then((data) => setNotifications(data || []))
        .catch(() => setNotifications([]));
    }
  }, [user]);

  const handleMarkRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;

    await fetch("/api/admin/notifications/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationIds: unread.map((n) => n.id) }),
    });

    // update local state
    setNotifications((prev) =>
      prev.map((n) =>
        unread.find((u) => u.id === n.id) ? { ...n, isRead: true } : n
      )
    );
  };

  // const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationsOpen = async (isOpen: boolean) => {
    if (!isOpen) return;

    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;

    try {
      const res = await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: unread.map((n) => n.id) }),
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            unread.find((u) => u.id === n.id) ? { ...n, isRead: true } : n
          )
        );
        console.log("✅ Notifications marked as read");
      } else {
        console.error("❌ Failed to mark notifications as read");
      }
    } catch (err) {
      console.error("⚠️ Error marking notifications:", err);
    }
  };

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut({ callbackUrl: "/", redirect: false });
    window.location.href = "/";
  };
  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="bg-orange-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-700 to-orange-600 text-white p-6 lg:p-6 fixed top-0 left-0 right-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* ✅ Hamburger menu for mobile */}
          <button
            className="lg:hidden p-2 rounded hover:bg-red-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <Crown className="w-8 hidden lg:block h-8 text-orange-400" />
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold capitalize">
              Welcome back, {user?.name || ""}
            </h1>
            {/* <p className="text-red-200">Your matrimonial journey continues</p> */}
          </div>
           <div className=" flex items-center gap-2 md:hidden">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                scrollY > 20
                  ? "bg-gradient-to-br from-red-600 to-orange-500"
                  : "bg-white/20 backdrop-blur-sm"
              }`}
            >
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                className={`text-base font-bold leading-tight ${
                  scrollY > 20 ? "text-red-700" : "text-white"
                }`}
              >
                Mauryavansham
              </h1>
              <p
                className={`text-xs leading-tight ${
                  scrollY > 20 ? "text-orange-600" : "text-orange-100"
                }`}
              >
                मौर्यवंश - गौरवशाली परंपरा
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          {user?.role === "user" && (
            <DropdownMenu onOpenChange={handleNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-red-700 relative"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  <span className="hidden lg:inline">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-800 rounded-full px-1.5 text-xs font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-72 max-h-96 overflow-y-auto"
              >
                {notifications.length > 0 && (
                  <div className="flex justify-between px-3 py-2 border-b border-yellow-200 bg-yellow-50 sticky top-0 z-10">
                    <h3 className="text-sm font-semibold text-red-700">
                      Notifications
                    </h3>
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            "/api/notifications/mark-all-read",
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ userId: user?.id }),
                            }
                          );

                          if (res.ok) {
                            setNotifications([]);
                            console.log("✅ All notifications marked as read");
                          } else {
                            console.error("❌ Failed to mark all as read");
                          }
                        } catch (err) {
                          console.error("⚠️ Error marking all as read:", err);
                        }
                      }}
                      className="text-xs text-blue-700 hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  </div>
                )}

                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-md border p-2 m-2 shadow-sm ${
                        n.isRead
                          ? "bg-gray-50 border-gray-200"
                          : "bg-yellow-50 border-yellow-300"
                      }`}
                    >
                      <DropdownMenuItem className="whitespace-normal text-sm">
                        {n.message}
                      </DropdownMenuItem>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-500 text-center">
                    No new notifications
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Account Menu */}
          {/* ✅ Mobile view: sirf logout icon */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-red-700"
              onClick={() => setIsOpen(true)}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          {/* ✅ Desktop view: pura Account menu */}
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

      {/* Sidebar + Main Content */}
      <div className="pt-24 flex">
        {/* Sidebar */}
        <div
          className={cn(
            "bg-yellow-50 border-yellow-200 rounded-lg p-4 w-64 h-[calc(100vh-6rem)] flex flex-col fixed top-24 z-30 transform transition-transform duration-300",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Profile section */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-14 h-14 rounded-full bg-gray-300 overflow-hidden shadow-md cursor-pointer"
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
            <div>
              <h3 className="font-semibold text-red-700">{user?.name}</h3>
              {/* <p className="text-sm text-red-600">{user?.role}</p> */}
            </div>
          </div>

          {/* Scrollable nav */}

          <nav className="space-y-2 overflow-y-auto flex-1">
            {sidebarItems.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isOpen = openMenus[item.title] || false;

              return (
                <div key={item.href || item.title} className="space-y-1">
                  {hasSubItems ? (
                    <>
                      {/* Parent button for submenus */}
                      <button
                        onClick={() => toggleMenu(item.title)}
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-orange-100 text-orange-700"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </div>
                        <span className="ml-2">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </span>
                      </button>

                      {/* Subitems */}
                      {isOpen && (
                        <div className="ml-6 space-y-1">
                          {item.subItems!.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={cn(
                                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                pathname === sub.href
                                  ? "bg-orange-50 text-orange-600"
                                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                              )}
                              onClick={() => setSidebarOpen(false)}
                            >
                              <sub.icon className="h-4 w-4" />
                              <span className="whitespace-pre-wrap w-32">
                                {sub.title}
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    // ✅ Direct link for simple items
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-orange-100 text-orange-700"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  )}
                </div>
              );
            })}
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
