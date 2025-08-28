"use client";

import { Crown } from "lucide-react";
import Translator from "@/src/hooks/googleTranslator";

export function TopHeader() {
  return (
    <header className="w-full relative z-50">
      <div className="bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="w-6 h-6 rounded flex items-center justify-center">
              <Crown className="text-white text-sm" />
            </div>
            <span className="font-medium text-sm">राजवंशी गौरव समुदाय</span>
          </div>
          <div className="flex items-center gap-2 text-white text-sm">
            <Translator />
          </div>
        </div>
      </div>
    </header>
  );
}
