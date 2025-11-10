"use client";

import React, { useEffect, useState } from "react";
import MobileViewLayout from "./mobileViewLayout";
import WebViewLayout from "./webVeiwLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // ✅ Detect React Native WebView first
    if (typeof window !== "undefined" && (window as any).ReactNativeWebView) {
      setIsMobile(true);
    } else {
      // ✅ Fallback for normal mobile browsers
      const userAgent = navigator.userAgent || "";
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Mobile Safari/i;
      setIsMobile(mobileRegex.test(userAgent));
    }
  }, []);

  if (isMobile) {
    return <MobileViewLayout>{children}</MobileViewLayout>;
  }

  return <WebViewLayout>{children}</WebViewLayout>;
}
