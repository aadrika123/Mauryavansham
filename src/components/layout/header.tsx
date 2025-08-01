"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { Menu, Search, Users, Heart, Crown } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { title: "Home", href: "/" },
    { title: "Heritage", href: "/heritage" },
    // { title: "Registration", href: "/registration" },
    { title: "Community Forum", href: "/community", icon: Users },
    { title: "Matrimonial", href: "/matrimonial", icon: Heart },
    // { title: "Events", href: "/events" },
    // { title: "Contact", href: "/contact" },
  ];

  return (
    <header className="w-full">
      {/* Top Bar */}
      {/* <div className="bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="w-6 h-6  rounded flex items-center justify-center">
              <Crown className="text-white text-sm" />
            </div>
            <span className="font-medium text-sm">राजवंशी गौरव समुदाय</span>
          </div>
          <div className="flex items-center gap-2 text-white text-sm">
              <select
                onChange={(e) => console.log(e.target.value)}
                className="w-28 text-xs border border-white text-white bg-transparent hover:bg-white hover:text-orange-600 rounded px-3 py-1"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Language
                </option>
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
          </div>
        </div>
      </div> */}

      {/* Main Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center shadow-lg">
              {/* <span className="text-yellow-400 text-xl">👑</span> */}
              <Crown className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-orange-600">
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
            <Button
              variant="outline"
              className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
            >
              <Link href="/sign-in">Login</Link>
            </Button>
            <Button className="bg-gradient-to-r to-[#ffae00] via-[#FF5C00] from-[#8B0000] hover:from-orange-600 hover:to-red-700 text-white">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-4">
                <div className="flex items-center space-x-2 pb-4 border-b">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center">
                    <span className="text-yellow-400 text-sm">👑</span>
                  </div>
                  <div>
                    <span className="font-bold text-orange-600">
                      Mauryavansh
                    </span>
                    <p className="text-xs text-red-700">
                      मौर्यवंश - गौरवशाली परंपरा
                    </p>
                  </div>
                </div>

                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-orange-50 text-red-800"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}

                <div className="pt-4 border-t space-y-2">
                  <Button className="w-full bg-gradient-to-r from-[#ffae00] to-[#FF5C00] via-[#8B0000] text-white">
                    Join Community
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-orange-500 text-orange-600 bg-transparent"
                  >
                    Login
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

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
