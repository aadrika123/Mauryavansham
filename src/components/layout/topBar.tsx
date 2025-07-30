"use client";

import { Crown } from "lucide-react";

export function TopHeader() {
  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] px-4 py-2">
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
      </div>
    </header>
  );
}
