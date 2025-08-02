"use client";

import { useEffect } from "react";
import { Crown } from "lucide-react";

export function TopHeader() {
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.type = "text/javascript";
      document.body.appendChild(script);

      // Define the init function globally
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
    };

    addGoogleTranslateScript();
  }, []);

  const handleLanguageChange = (lang: string) => {
    const iframe = document.querySelector("iframe.goog-te-menu-frame") as HTMLIFrameElement;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    const spanElements = iframeDoc?.querySelectorAll(".goog-te-menu2-item span.text");
    spanElements?.forEach((span) => {
      if (lang === "hi" && span.textContent === "Hindi") {
        (span.parentElement as HTMLElement).click();
      } else if (lang === "en" && span.textContent === "English") {
        (span.parentElement as HTMLElement).click();
      }
    });
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
              defaultValue=""
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
