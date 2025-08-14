"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Eye,
  Users,
  Crown,
  TrendingUp,
  Bell,
  Settings,
  Search,
  Star,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import type { User as NextAuthUser } from "next-auth";
import { Sidebar } from "@/src/components/layout/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Dashboard( props :any) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  console.log(session, "session");
  const user = session?.user as NextAuthUser;
  // Mock data - replace with real data from your API
  const dashboardStats = {
    profileViews: 45,
    interests: 12,
    messages: 8,
    matches: 3,
  };

  const recentActivities = [
    {
      id: 1,
      type: "view",
      message: "Priya Maurya viewed your profile",
      time: "2 hours ago",
      avatar: "PM",
    },
    {
      id: 2,
      type: "interest",
      message: "You received interest from Rohit Kushwaha",
      time: "5 hours ago",
      avatar: "RK",
    },
    {
      id: 3,
      type: "message",
      message: "New message from Anita Maurya",
      time: "1 day ago",
      avatar: "AM",
    },
  ];

  const suggestedProfiles = [
    {
      id: 1,
      name: "Kavya Maurya",
      age: 26,
      location: "Delhi",
      education: "MBA",
      occupation: "Marketing Manager",
      compatibility: 92,
      avatar: "KM",
    },
    {
      id: 2,
      name: "Ravi Kushwaha",
      age: 29,
      location: "Mumbai",
      education: "B.Tech",
      occupation: "Software Engineer",
      compatibility: 88,
      avatar: "RK",
    },
  ];
  const handleSignOut = async () => {
    setIsOpen(false); // Close modal
    await signOut({
      callbackUrl: "/", // Redirect to home
      redirect: false, // Prevent full page reload
    });
    window.location.href = "/"; // Manually redirect without loading /api/auth/signout in tab
  };
  return (
    <div className=" bg-orange-50">
      
    </div>
  );
}
