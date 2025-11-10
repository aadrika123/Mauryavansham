"use client";

import React from "react";
import { Crown, Menu } from "lucide-react";
import Translator from "@/src/hooks/googleTranslator";

interface MobileTopHeaderProps {
  scrollY: number;
  setSidebarOpen: (value: boolean) => void;
}

export default function MobileTopHeader({
  scrollY,
  setSidebarOpen,
}: MobileTopHeaderProps) {
  return (
    <div
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrollY > 20
          ? "bg-white shadow-md"
          : "bg-gradient-to-r from-red-700 to-orange-600"
      }`}
    >
      <div className="px-4 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle */}
            <button
              className="p-2 hover:bg-white/10 rounded-lg active:scale-95 transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu
                className={`w-6 h-6 ${
                  scrollY > 20 ? "text-gray-700" : "text-white"
                }`}
              />
            </button>

            {/* Logo + Title */}
            <div className="flex items-center gap-2">
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

          {/* Translator Button */}
          <div className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all">
            <Translator />
          </div>
        </div>
      </div>
    </div>
  );
}
