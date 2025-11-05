"use client";

import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Toaster } from "@/src/components/ui/toaster";
import "../../../styles/globals.css";
import { Header } from "@/src/components/layout/header";
import { Footer } from "@/src/components/layout/footer";
import { ConditionalTopHeader } from "@/src/components/layout/conditionalTopHeader";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function WebViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        {/* ✅ Google Analytics script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Z35P4CZ619"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Z35P4CZ619');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <ConditionalTopHeader />
        <Header />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
        <Footer />
      </body>
    </>
  );
}
