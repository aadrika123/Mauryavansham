"use client";

import { useEffect, useState } from "react";

export default function Translator() {
  const [showDropdown, setShowDropdown] = useState(false);

  // Google Translate init
  const googleTranslateElementInit = () => {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi",
          autoDisplay: false,
        },
        "google_translate_element"
      );
      removeGoogleTranslateToolbar();
    }
  };

  // Toolbar hide logic
  const removeGoogleTranslateToolbar = () => {
    const elementsToHide = [
      ".goog-te-banner-frame", // top yellow banner
      "#goog-gt-tt", // tooltip
      ".goog-te-balloon-frame", // popup balloon
      "body > .skiptranslate", // wrapper div
      ".goog-logo-link", // Google branding link
    ];

    elementsToHide.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        (element as HTMLElement).style.display = "none";
      }
    });

    document.body.style.top = "0px"; // Prevents layout shifting
  };

  useEffect(() => {
    // prevent duplicate script
    if (document.getElementById("google-translate-script")) return;

    const addScript = document.createElement("script");
    addScript.id = "google-translate-script";
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    addScript.async = true;
    document.body.appendChild(addScript);

    (window as any).googleTranslateElementInit = googleTranslateElementInit;

    // keep removing toolbar every second
    const interval = setInterval(removeGoogleTranslateToolbar, 1000);

    return () => {
      clearInterval(interval);
      if (document.getElementById("google-translate-script")) {
        document.body.removeChild(addScript);
      }
    };
  }, []);

  // Language change handler
  const changeLanguage = (selectedLang: string) => {
    const fireEvent = (element: HTMLElement, eventName: string) => {
      const event = document.createEvent("HTMLEvents");
      event.initEvent(eventName, true, true);
      element.dispatchEvent(event);
    };

    const applyLang = () => {
      const select = document.querySelector(
        ".goog-te-combo"
      ) as HTMLSelectElement;
      if (select) {
        select.value = selectedLang;
        fireEvent(select, "change");
        removeGoogleTranslateToolbar();
      } else {
        setTimeout(applyLang, 500); // retry until loaded
      }
    };

    applyLang();
  };

  return (
    <>
      {/* Hard CSS Hide */}
      <style>
        {`
          .goog-te-banner-frame {
            display: none !important;
          }
          .goog-logo-link {
            display: none !important;
          }
          .goog-te-gadget {
            height: 28px !important;
            overflow: hidden !important;
          }
          body {
            top: 0px !important;
          }
        `}
      </style>

      <div className="flex items-center border border-white rounded-sm shadow-sm">
        {/* Google Translate required hidden div */}
        <div
          id="google_translate_element"
          style={{ position: "absolute", left: "-9999px" }}
        ></div>

        <div className="relative">
          <button
            className="flex items-center justify-center p-2 rounded-md"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="mr-2 text-black">🌐</span> Language
          </button>

          {showDropdown && (
            <div className="absolute top-10 right-0 bg-white shadow-md rounded-md p-2 text-black">
              <button
                onClick={() => {
                  changeLanguage("en");
                  setShowDropdown(false);
                }}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                English
              </button>
              <button
                onClick={() => {
                  changeLanguage("hi");
                  setShowDropdown(false);
                }}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                हिन्दी
              </button>
              {/* <button
                onClick={() => {
                  changeLanguage("mr");
                  setShowDropdown(false);
                }}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                मराठी
              </button> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
