'use client';

import React, { useEffect, useState } from 'react';
import MobileLayout from './mobileViewLayout';
import AuthLayout from './webVeiwLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // ✅ Check if running inside React Native WebView
    if (typeof window !== 'undefined' && (window as any).ReactNativeWebView) {
      setIsMobile(true);
    } else {
      const userAgent = navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Mobile Safari/i;
      setIsMobile(mobileRegex.test(userAgent));
    }
  }, []);

  return isMobile ? <MobileLayout>{children}</MobileLayout> : <AuthLayout>{children}</AuthLayout>;
}
