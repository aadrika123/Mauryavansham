"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/src/lib/utils"
import {
  LayoutDashboard,
  Users,
  Heart,
  ShoppingBag,
  Calendar,
  HandHeart,
  Trophy,
  Globe,
  MessageSquare,
  Settings,
  User,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Home",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Community",
    href: "/community",
    icon: Users,
  },
  {
    title: "Matrimonial",
    href: "/matrimonial",
    icon: Heart,
  },
  {
    title: "Trading",
    href: "/trading",
    icon: ShoppingBag,
  },
  {
    title: "Events",
    href: "/events",
    icon: Calendar,
  },
  {
    title: "Help Exchange",
    href: "/help",
    icon: HandHeart,
  },
  {
    title: "Achievements",
    href: "/achievements",
    icon: Trophy,
  },
  {
    title: "Heritage",
    href: "/heritage",
    icon: Globe,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-yellow-50  min-h-screen p-4">
      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-orange-100 text-orange-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
