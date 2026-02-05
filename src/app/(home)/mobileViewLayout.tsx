'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Inter } from 'next/font/google';
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
  User,
  Lock,
  Bell
} from 'lucide-react';
import { ThemeProvider } from '@/src/components/theme-provider';
import { Toaster } from '@/src/components/ui/toaster';
import { useRouter, usePathname } from 'next/navigation';
import '../../../styles/globals.css';
import { Footer } from '@/src/components/layout/footer';
import { Button } from '@/src/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { FaSpinner } from 'react-icons/fa6';
import Translator from '@/src/hooks/googleTranslator';
import { ToastProvider } from '@/src/components/ui/toastProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';
import { FaAndroid, FaApple } from 'react-icons/fa';

const inter = Inter({ subsets: ['latin'] });

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const loginUser = session?.user;
  const userDetails = session?.user;
  const userName = session?.user?.name || 'User';
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const role = session?.user?.role;

  const unreadNotifications = notifications.filter(n => !n.isRead || n.isRead === 0);
  const unreadCount = unreadNotifications.length;
  const [open, setOpen] = useState(false);
  const [isWebView, setIsWebView] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isRNWebView = typeof window !== 'undefined' && (window as any).ReactNativeWebView !== undefined;

    setIsWebView(isRNWebView);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: Crown, label: 'Home', path: '/' },
    { icon: Heart, label: 'Matrimonial', path: '/matrimonial' },
    { icon: Calendar, label: 'Events', path: '/events' },
    { icon: Landmark, label: 'Heritage', path: '/heritage' },
    { icon: Users, label: 'Profile', path: '/profile' }
  ];

  const navigationItems = [
    { title: 'Home', href: '/', icon: House },
    { title: 'Heritage', href: '/heritage', icon: Landmark },
    { title: 'Community Forum', href: '/community', icon: Users },
    { title: 'Matrimonial', href: '/matrimonial', icon: HeartHandshake },
    { title: 'Events & Calendar', href: '/events', icon: Calendar },
    { title: 'Business Forum', href: '/business', icon: ShoppingBag },
    { title: 'Health & Wellness', href: '/health-wellness', icon: HandHeart },
    { title: 'Education', href: '/education', icon: Crown },
    { title: 'Achievements', href: '/achievements', icon: Trophy },
    { title: 'Blogs', href: '/blogs', icon: ShoppingBag }
  ];

  console.log(unreadNotifications, 'notifications');

  // fetch notifications
  useEffect(() => {
    if (role === 'admin' || role === 'superAdmin' || role === 'user') {
      fetch('/api/admin/notifications')
        .then(res => res.json())
        .then(data => {
          const notifs = Array.isArray(data) ? data : data.data || [];
          setNotifications(notifs);
        })
        .catch(err => console.error('Failed to fetch notifications:', err));
    }
  }, [role]);

  const markAllAsRead = async () => {
    try {
      const url =
        role === 'admin' || role === 'superAdmin'
          ? '/api/notifications/mark-all-read'
          : '/api/notifications/mark-all-read';
      await fetch(url, { method: 'POST' });
      // fetchNotifications();
    } catch (err) {
      console.error('Error marking notifications:', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [loginUser?.id]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    // <html lang="en">
    <div className={`${inter.className} bg-gray-50`}>
      {/* ===== Mobile Header ===== */}
      <div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrollY > 20 ? 'bg-gradient-to-r from-red-700 to-orange-600' : 'bg-gradient-to-r from-red-700 to-orange-600'
        }`}
      >
        <div className="px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="p-2 hover:bg-white/10 rounded-lg active:scale-95 transition-all"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className={`w-6 h-6 ${scrollY > 20 ? 'text-white' : 'text-white'}`} />
              </button>

              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
                    scrollY > 20
                      ? 'bg-gradient-to-br from-red-600 to-orange-500'
                      : 'bg-gradient-to-br from-red-600 to-orange-500'
                  }`}
                >
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-base font-bold leading-tight ${scrollY > 20 ? 'text-white' : 'text-white'}`}>
                    Mauryavansham
                  </h1>
                  <p className={`text-xs leading-tight ${scrollY > 20 ? 'text-orange-100' : 'text-orange-100'}`}>
                    मौर्यवंश - गौरवशाली परंपरा
                  </p>
                </div>
              </div>
            </div>
            {/* Notification */}
            {/* ===== Notification Dropdown ===== */}
            <DropdownMenu
              onOpenChange={async isOpen => {
                if (!isOpen) return;
                const unread = notifications.filter(n => !n.isRead);
                if (unread.length === 0) return;

                try {
                  const res = await fetch('/api/notifications/mark-read', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      notificationIds: unread.map(n => n.id)
                    })
                  });

                  if (res.ok) {
                    setNotifications(prev =>
                      prev.map(n => (unread.find(u => u.id === n.id) ? { ...n, isRead: true } : n))
                    );
                  } else {
                    console.error('❌ Failed to mark notifications as read');
                  }
                } catch (err) {
                  console.error('⚠️ Error marking notifications:', err);
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <button className="relative flex flex-col items-center">
                  <Bell className="w-5 h-5 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-72 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="flex justify-between items-center px-3 py-2 border-b">
                  <h4 className="text-sm font-semibold text-gray-800">Notifications</h4>
                  {unreadCount == 0 && (
                    <button
                      onClick={async () => {
                        try {
                          await fetch('/api/notifications/mark-all-read', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: loginUser?.id })
                          });
                          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                        } catch (err) {
                          console.error('Error marking all as read:', err);
                        }
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {unreadNotifications.length > 0 ? (
                    unreadNotifications.map((n, idx) => (
                      <DropdownMenuItem
                        key={idx}
                        className={`px-3 py-2 text-sm border-b cursor-default ${!n.isRead ? 'bg-red-50' : ''}`}
                      >
                        <p className="font-medium text-gray-800">{n.title}</p>
                        <p className="text-xs text-gray-500">{n.message}</p>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-gray-500 text-center">No notifications</div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all`}
            >
              <Translator />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Page Content ===== */}
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <ToastProvider>
          <div className="pb-[70px] min-h-screen">{children}</div>
          <Toaster />
        </ToastProvider>
      </ThemeProvider>

      {/* ===== Bottom Navigation ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 shadow-2xl z-40">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            const handleNavigation = () => {
              if (item.label === 'Profile') {
                if (!isAuthenticated) {
                  setShowLoginModal(true);
                  return;
                }

                if (userDetails?.role === 'user') {
                  router.push(`/dashboard/user-profile/${userDetails?.id}`);
                } else if (userDetails?.role === 'admin' || userDetails?.role === 'superAdmin') {
                  router.push(`/admin/user-profile/${userDetails?.id}`);
                } else {
                  router.push('/profile');
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
                    isActive ? 'bg-gradient-to-r from-red-600 to-orange-500' : ''
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <span className={`text-xs ${isActive ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
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
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                      strokeDashoffset={2 * Math.PI * 36 * (1 - (profileData?.profileCompletion || 0) / 100)}
                      strokeLinecap="round"
                      stroke="url(#gradientMobile)"
                      fill="transparent"
                      r="36"
                      cx="40"
                      cy="40"
                    />
                    <defs>
                      <linearGradient id="gradientMobile" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="orange" />
                        <stop offset="100%" stopColor="green" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {!loading ? (
                    <div className="w-18 h-18 rounded-full bg-gray-300 overflow-hidden shadow-md absolute top-1 left-1">
                      <img
                        src={profileData?.data?.photo || '/placeholder.svg'}
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
            {navigationItems.map(item => {
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
                      router.push('/sign-in');
                      setSidebarOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-white text-red-600 w-full"
                    onClick={() => {
                      router.push('/sign-up');
                      setSidebarOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  {userDetails?.role === 'user' ? (
                    <Button
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white w-full"
                      onClick={() => {
                        router.push('/dashboard');
                        setSidebarOpen(false);
                      }}
                    >
                      Main Panel
                    </Button>
                  ) : userDetails?.role === 'admin' || userDetails?.role === 'superAdmin' ? (
                    <Button
                      className="bg-gradient-to-r from-orange-500 to-red-600 text-white w-full"
                      onClick={() => {
                        router.push('/admin/overview');
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
              {!isWebView && (
                <div className="relative" ref={dropdownRef}>
                  <Button
                    onClick={() => setOpen(!open)}
                    className="text-white text-sm bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-md transition"
                  >
                    📲 Download Mobile App
                  </Button>

                  {open && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg overflow-hidden z-50">
                      {/* Android */}
                      <a
                        href={`${process.env.NEXT_PUBLIC_APP_URL}/App/Mauryavansham.apk`}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                        download
                      >
                        <FaAndroid className="text-green-600" /> Android App
                      </a>

                      {/* iOS */}
                      <div className="flex items-center gap-2 px-4 py-2 text-gray-400 text-sm cursor-not-allowed bg-gray-50">
                        <FaApple className="text-gray-400" /> iOS App (Coming Soon)
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Overlay */}
          <div className="flex-1 bg-black bg-opacity-50 pointer-events-auto" onClick={() => setSidebarOpen(false)} />
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
              <button onClick={() => setShowLoginModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">Please login to access your profile.</p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/sign-in')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button onClick={() => setShowLoginModal(false)} variant="outline" className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    // </html>
  );
}
