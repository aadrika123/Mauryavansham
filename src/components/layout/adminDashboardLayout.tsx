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
  ChevronUp,
  ChevronDown,
  HeartHandshakeIcon,
  BookAIcon,
  AmbulanceIcon,
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
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const unreadCount =
    notifications?.filter((n) => !n.isRead || n.isRead === 0).length || 0;
  const unreadNotifications = notifications.filter(
    (n) => !n.isRead || n.isRead === 0
  );

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "superAdmin") {
      fetch("/api/admin/notifications")
        .then((res) => res.json())
        .then((data) => {
          // ✅ handle both raw array or { data: [] }
          const notifs = Array.isArray(data) ? data : data.data || [];
          setNotifications(notifs);
        })
        .catch((err) => console.error("Failed to fetch notifications:", err));
    }
  }, [user]);

  // Sidebar items for regular admin
  const adminSidebarItems = [
    { title: "Home", href: "/", icon: LayoutDashboard },
    { title: "Dashboard", href: "/admin/overview", icon: LayoutDashboard },

    {
      title: "My Inbox",
      href: "/admin/messenger-page",
      icon: MessageSquare,
    },
    { title: "Manage Users", href: "/admin/users", icon: Users },

    {
      title: "Events",
      href: "",
      icon: Camera,
      subItems: [
        { title: "Create Events", href: "/admin/events", icon: Calendar },
        { title: "My Events", href: "/admin/my-events", icon: Calendar },
      ],
    },
    {
      title: "Matrimonial",
      href: "",
      icon: Camera,
      subItems: [
        {
          title: "Create Matrimonial Profile",
          href: "/admin/create-profile",
          icon: LayoutDashboard,
        },
        {
          title: "My Matrimonial Profiles",
          href: "/admin/profile-list",
          icon: LayoutDashboard,
        },
        {
          title: "Search Matrimonial Profiles",
          href: "/admin/search-profile",
          icon: Search,
        },
      ],
    },
    // { title: "Create Events", href: "/admin/events", icon: Calendar },
    { title: "My Blog's", href: "/admin/my-blogs", icon: Camera },
    { title: "Book Ads", href: "/admin/book-ads", icon: Tv },
    // {
    //   title: "Discussions Moderation",
    //   href: "/admin/discussions",
    //   icon: MessageSquare,
    // },
    {
      title: "Business",
      href: "",
      icon: Tv,
      subItems: [
        {
          title: "Register-business",
          href: "/admin/register-business",
          icon: Wallet2Icon,
        },
        {
          title: "My Registered-business",
          href: "/admin/view-business",
          icon: Wallet2Icon,
        },
      ],
    },
    {
      title: "Education & Coaching",
      href: "",
      icon: BookAIcon,
      subItems: [
        {
          title: "Register Coaching",
          href: "/admin/register-coaching",
          icon: BookAIcon,
        },
        {
          title: "My Registered Coaching",
          href: "/admin/register-coaching/view",
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
          href: "/admin/health-wellness",
          icon: BookAIcon,
        },
        {
          title: "My Registered Health Services",
          href: "/admin/health-wellness/view",
          icon: BookAIcon,
        },
      ],
    },
  ];

  const superAdminSidebarItems = [
    { title: "Home", href: "/", icon: LayoutDashboard },
    { title: "Dashboard", href: "/admin/overview", icon: LayoutDashboard },
    {
      title: "My Inbox",
      href: "/admin/messenger-page",
      icon: MessageSquare,
    },
    { title: "Manage Users", href: "/admin/users", icon: Users },
    // { title: "Create Events", href: "/admin/events", icon: Calendar },
    // { title: "My Events", href: "/admin/my-events", icon: Calendar },
    {
      title: "Events",
      href: "",
      icon: Camera,
      subItems: [
        { title: "Create Events", href: "/admin/events", icon: Calendar },
        { title: "My Events", href: "/admin/my-events", icon: Calendar },
      ],
    },
    { title: "All Users", href: "/admin/manage-users", icon: Users },

    {
      title: "Modarations",
      href: "",
      icon: Tv,
      subItems: [
        { title: "Ad Moderation", href: "/admin/ads", icon: Tv },
        { title: "Blog Moderation", href: "/admin/blogs", icon: Camera },
        {
          title: "Discussions Moderation",
          href: "/admin/discussions",
          icon: MessageSquare,
        },
        {
          title: "Event Moderation",
          href: "/admin/event-modaration",
          icon: Calendar,
        },
        {
          title: "Register business Moderation",
          href: "/admin/register-business",
          icon: Wallet2Icon,
        },
        // {
        //   title: "Discussions Moderation",
        //   href: "/admin/discussions",
        //   icon: MessageSquare,
        // },
      ],
    },
    {
      title: "Business",
      href: "",
      icon: Wallet2Icon,
      subItems: [
        {
          title: "Register-business",
          href: "/admin/register-business",
          icon: Wallet2Icon,
        },
        {
          title: "My Registered-business",
          href: "/admin/view-business",
          icon: Wallet2Icon,
        },
      ],
    },
    {
      title: "Matrimonial",
      href: "",
      icon: HeartHandshakeIcon,
      subItems: [
        {
          title: "Create Matrimonial Profile",
          href: "/admin/create-profile",
          icon: LayoutDashboard,
        },
        {
          title: "My Matrimonial Profiles",
          href: "/admin/profile-list",
          icon: LayoutDashboard,
        },
        {
          title: "Search Matrimonial Profiles",
          href: "/admin/search-profile",
          icon: Search,
        },
      ],
    },

    {
      title: "All Masters",
      href: "",
      icon: Wallet2Icon,
      subItems: [
        { title: "Ads Rates", href: "/admin/ad-rates", icon: Tv },
        {
          title: "Ads Location Master",
          href: "/admin/ads-location-master",
          icon: Tv2,
        },
        {
          title: "Discussion Category Master",
          href: "/admin/discussion-castegory-master",
          icon: Globe,
        },
      ],
    },

    { title: "My Blog's", href: "/admin/my-blogs", icon: Camera },
    { title: "Book Ads", href: "/admin/book-ads", icon: Tv },
    {
      title: "Education & Coaching",
      href: "",
      icon: BookAIcon,
      subItems: [
        {
          title: "Register Coaching",
          href: "/admin/register-coaching",
          icon: BookAIcon,
        },
        {
          title: "My Registered Coaching",
          href: "/admin/register-coaching/view",
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
          href: "/admin/health-wellness",
          icon: BookAIcon,
        },
        {
          title: "My Registered Health Services",
          href: "/admin/health-wellness/view",
          icon: BookAIcon,
        },
      ],
    },
    {
      title: "Reports",
      href: "",
      icon: BookAIcon,
      subItems: [
        { title: "User Reports", href: "/admin/reports/users", icon: Users },
        {
          title: "Matrimonial Reports",
          href: "/admin/reports/matrimonial",
          icon: HeartHandshakeIcon,
        },
        {
          title: "Business Reports",
          href: "/admin/reports/business",
          icon: Wallet2Icon,
        },
        { title: "Blog Reports", href: "/admin/reports/blogs", icon: Camera },
        { title: "Ads Reports", href: "/admin/reports/ads", icon: Tv },
        {
          title: "Event Reports",
          href: "/admin/reports/events",
          icon: Calendar,
        },
        {
          title: "Discussion Reports",
          href: "/admin/reports/discussions",
          icon: MessageSquare,
        },
        // {
        //   title: "Master Data Reports",
        //   href: "/admin/reports/masters",
        //   icon: Globe,
        // },
        // optional existing item
      ],
    },
  ];
  const handleOpenNotifications = async (isOpen: boolean) => {
    if (!isOpen) return;

    const unread = notifications.filter((n) => !n.isRead || n.isRead === 0);
    if (unread.length === 0) return;

    try {
      const res = await fetch("/api/admin/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationIds: unread.map((n) => n.id) }),
      });

      if (res.ok) {
        // ✅ Update UI instantly
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: 1 })));
        console.log("✅ Notifications marked as read");
      } else {
        console.error("❌ Failed to mark notifications as read");
      }
    } catch (err) {
      console.error("⚠️ Error marking notifications:", err);
    }
  };

  const sidebarItems =
    user?.role === "superAdmin" ? superAdminSidebarItems : adminSidebarItems;

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut({ callbackUrl: "/", redirect: false });
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };
  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="bg-orange-50 min-h-screen">
      {/* Header */}
      <div className="bg-red-800 text-white p-6 lg:p-6 fixed top-0 left-0 right-0 z-20 flex items-center justify-between">
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
          <Crown className="w-8 h-8 text-orange-400" />
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold capitalize">
              Welcome back, {user?.name || ""} ({user?.role})
            </h1>
            {/* <p className="text-red-200">Your matrimonial journey continues</p> */}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Notifications */}
          {(user?.role === "admin" || user?.role === "superAdmin") && (
            <DropdownMenu onOpenChange={handleOpenNotifications}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-red-700 relative"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  <span className="hidden lg:inline">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-800 rounded-full px-1.5 text-xs font-bold shadow">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-80 max-h-96 overflow-y-auto"
              >
                {/* ✅ Header section with "Mark All as Read" button */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-yellow-200 bg-yellow-50 sticky top-0 z-10">
                  <h3 className="text-sm font-semibold text-red-700">
                    Notifications
                  </h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            "/api/notifications/mark-all-read",
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              // body: JSON.stringify({ userId: user?.id }),
                            }
                          );

                          if (res.ok) {
                            // ✅ Clear all notifications from UI
                            setNotifications([]);
                            console.log(
                              "✅ All notifications marked as read for user:",
                              user?.id
                            );
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
                  )}
                </div>

                {/* ✅ Notification list */}
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map((n) => (
                    <div
                      key={n.id}
                      className="bg-yellow-50 rounded-md border border-yellow-200 p-2 m-2 hover:bg-yellow-100 shadow-sm"
                    >
                      <DropdownMenuItem className="whitespace-normal text-sm">
                        {n.message}
                      </DropdownMenuItem>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500 text-sm">
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
      <div className="flex h-screen bg-orange-50">
        {/* Sidebar */}
        <div
          className={cn(
            "bg-yellow-50 border-yellow-200 w-64 p-4 flex flex-col",
            "fixed top-24 left-0 h-[calc(100%-6rem)] z-30 transition-transform duration-300", // top-24 = header height
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {/* Profile + Navigation */}
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-14 h-14 rounded-full bg-gray-300 overflow-hidden shadow-md cursor-pointer"
                onClick={() =>
                  (window.location.href = "/admin/user-profile/" + user?.id)
                }
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

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto space-y-2">
              {sidebarItems.map((item) => {
                const hasSubItems = (item.subItems?.length ?? 0) > 0;
                const isOpen = openMenus[item.title] || false;

                return (
                  <div key={item.href || item.title} className="space-y-1">
                    {hasSubItems ? (
                      <>
                        <button
                          onClick={() => toggleMenu(item.title)}
                          className={cn(
                            "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium",
                            pathname === item.href
                              ? "bg-orange-100 text-orange-700"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="ml-6 space-y-1">
                            {item.subItems!.map((sub) => (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={cn(
                                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium",
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
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium",
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
        </div>

        {/* Main content */}
        <div className="flex-1 ml-0 lg:ml-64 pt-24 overflow-y-auto h-screen">
          {children}
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
