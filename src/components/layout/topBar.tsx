"use client";

import { useEffect, useState } from "react";
import { FaAndroid, FaApple } from "react-icons/fa";
import Translator from "@/src/hooks/googleTranslator";
import { Crown } from "lucide-react";

export function TopHeader() {
  const [open, setOpen] = useState(false);
  const [isWebView, setIsWebView] = useState(false);

  useEffect(() => {
    // Detect if running inside React Native WebView
    if (typeof window !== "undefined" && (window as any).ReactNativeWebView) {
      setIsWebView(true);
    }
  }, []);

  return (
    <header className="w-full relative z-50">
      <div className="bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          {/* Left Side Title */}
          <div className="flex items-center gap-2 text-white">
            <div className="w-6 h-6 rounded flex items-center justify-center">
              <Crown className="text-white text-sm" />
            </div>
            <span className="font-medium text-sm">राजवंशी गौरव समुदाय</span>
          </div>

          {/* Right Side: Download + Translator */}
          <div className="flex items-center gap-4 text-white text-sm relative">
            {/* Download Button — only visible on web */}
            {!isWebView && (
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="text-white text-sm bg-black/20 hover:bg-black/30 px-3 py-1.5 rounded-md transition"
                >
                  📲 Download Mobile App
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-700 rounded-md shadow-lg overflow-hidden z-50">
                    {/* Android Option */}
                    <a
                      href="https://mauryavansh.com/App/Mauryavansham.apk"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                      download
                    >
                      <FaAndroid className="text-green-600" /> Android App
                    </a>

                    {/* iOS Option (Disabled) */}
                    <div className="flex items-center gap-2 px-4 py-2 text-gray-400 text-sm cursor-not-allowed bg-gray-50">
                      <FaApple className="text-gray-400" /> iOS App (Coming Soon)
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Translator */}
            <Translator />
          </div>
        </div>
      </div>
    </header>
  );
}
