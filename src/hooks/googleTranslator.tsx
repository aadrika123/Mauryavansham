'use client';

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export default function Translator() {
  const [showDropdown, setShowDropdown] = useState(false);

  // Google Translate init
  const googleTranslateElementInit = () => {
    if (window.google && window.google.translate) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi',
          autoDisplay: false
        },
        'google_translate_element'
      );
      removeGoogleTranslateToolbar();
    }
  };

  // Toolbar hide logic
  const removeGoogleTranslateToolbar = () => {
    const elementsToHide = [
      '.goog-te-banner-frame',
      '#goog-gt-tt',
      '.goog-te-balloon-frame',
      'body > .skiptranslate',
      '.goog-logo-link'
    ];

    elementsToHide.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        (element as HTMLElement).style.display = 'none';
      }
    });

    document.body.style.top = '0px';
  };

  useEffect(() => {
    // prevent duplicate script
    if (document.getElementById('google-translate-script')) return;

    const addScript = document.createElement('script');
    addScript.id = 'google-translate-script';
    addScript.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    addScript.async = true;
    document.body.appendChild(addScript);

    (window as any).googleTranslateElementInit = googleTranslateElementInit;

    const interval = setInterval(removeGoogleTranslateToolbar, 1000);

    return () => {
      clearInterval(interval);
      if (document.getElementById('google-translate-script')) {
        document.body.removeChild(addScript);
      }
    };
  }, []);

  // Language change handler
  const changeLanguage = (selectedLang: string) => {
    const applyLang = () => {
      const select = document.querySelector(
        '.goog-te-combo'
      ) as HTMLSelectElement;

      if (select) {
        select.value = selectedLang;

        const event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, true);
        select.dispatchEvent(event);

        // ✅ Force reload for mobile browsers (important)
        const iframe = document.querySelector('iframe.goog-te-menu-frame');
        if (iframe) {
          (iframe as HTMLIFrameElement).contentWindow?.location.reload();
        }

        removeGoogleTranslateToolbar();
      } else {
        // Retry until loaded
        setTimeout(applyLang, 800);
      }
    };

    applyLang(); // ✅ You missed this call earlier!
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

      <div className="flex items-center lg:border lg:border-white md:border md:border-white rounded-sm shadow-sm">
        {/* Google Translate hidden div */}
        <div
          id="google_translate_element"
          style={{ position: 'absolute', left: '-9999px' }}
        ></div>

        <div className="relative">
          <button
            className="flex items-center justify-center p-2 rounded-md"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {/* Mobile View: Custom A/अ icon */}
            <span className="block md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="26"
                height="26"
              >
                <rect width="48" height="48" rx="10" fill="#f3f4f6" />
                <text
                  x="14"
                  y="30"
                  fontSize="18"
                  fontWeight="bold"
                  fill="#1f2937"
                  fontFamily="Arial, sans-serif"
                >
                  A
                </text>
                <text
                  x="28"
                  y="30"
                  fontSize="18"
                  fontWeight="bold"
                  fill="#dc2626"
                  fontFamily="Noto Sans Devanagari, sans-serif"
                >
                  अ
                </text>
              </svg>
            </span>

            {/* Desktop View */}
            <span className="hidden md:flex items-center text-black">
              <span className="mr-2 text-xl">🌐</span> Language
            </span>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-10 right-0 bg-white shadow-md rounded-md p-2 text-black w-32">
              <button
                onClick={() => {
                  changeLanguage('en');
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                English
              </button>
              <button
                onClick={() => {
                  changeLanguage('hi');
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                हिन्दी
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
