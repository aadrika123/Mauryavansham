import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Toaster } from "@/src/components/ui/toaster";
import "../../../styles/globals.css";
import { Header } from "@/src/components/layout/header";
import { Footer } from "@/src/components/layout/footer";
import { ConditionalTopHeader } from "@/src/components/layout/conditionalTopHeader";
import Script from "next/script";  // 👈 import Script

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mauryavansham - Hindu Maurya Community Portal",
  description:
    "A comprehensive digital platform for the Hindu Maurya (Kushwaha) community fostering social connectivity, cultural preservation, and mutual support.",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
    </html>
  );
}
