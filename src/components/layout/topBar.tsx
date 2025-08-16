"use client";

import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import { usePathname } from "next/navigation";

export function TopHeader() {
  const pathname = usePathname();
  const [selectedLang, setSelectedLang] = useState("");

  // Load Google Translate script once
  useEffect(() => {
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.type = "text/javascript";
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = function () {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi",
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          "google_translate_element"
        );
      };
    }

    // Restore last selected language
    const savedLang = localStorage.getItem("selectedLang");
    if (savedLang) {
      setSelectedLang(savedLang);
      setTimeout(() => handleLanguageChange(savedLang), 1500); // delay for script load
    }
  }, []);

  // Re-apply translation on route change
  useEffect(() => {
    if (selectedLang) {
      setTimeout(() => handleLanguageChange(selectedLang), 1000);
    }
  }, [pathname]);

  const handleLanguageChange = (lang: string) => {
    localStorage.setItem("selectedLang", lang);
    setSelectedLang(lang);

    const tryClickLang = () => {
      const iframe = document.querySelector("iframe.goog-te-menu-frame") as HTMLIFrameElement;
      if (!iframe) {
        setTimeout(tryClickLang, 500);
        return;
      }

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      const spanElements = iframeDoc?.querySelectorAll(".goog-te-menu2-item span.text");

      spanElements?.forEach((span) => {
        if (lang === "hi" && span.textContent?.trim() === "Hindi") {
          (span.parentElement as HTMLElement).click();
        } else if (lang === "en" && span.textContent?.trim() === "English") {
          (span.parentElement as HTMLElement).click();
        }
      });
    };

    tryClickLang();
  };

  return (
    <header className="w-full relative z-50">
      {/* Google Translate hidden element */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      {/* Top Bar */}
      <div className="bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="w-6 h-6 rounded flex items-center justify-center">
              <Crown className="text-white text-sm" />
            </div>
            <span className="font-medium text-sm">राजवंशी गौरव समुदाय</span>
          </div>
          <div className="flex items-center gap-2 text-white text-sm">
            <select
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-28 text-xs border border-white text-white bg-transparent hover:bg-white hover:text-orange-600 rounded px-3 py-1"
              value={selectedLang || ""}
            >
              <option value="" disabled>
                Select Language
              </option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
