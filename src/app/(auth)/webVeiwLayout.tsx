"use client";

import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/src/components/theme-provider";
import { Toaster } from "@/src/components/ui/toaster";
import "../../../styles/globals.css";
import { Header } from "@/src/components/layout/header";
import { Footer } from "@/src/components/layout/footer";
import { ConditionalTopHeader } from "@/src/components/layout/conditionalTopHeader";
import { ToastProvider } from "@/src/components/ui/toastProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mauryavansham - Hindu Maurya Community Portal",
  description:
    "A comprehensive digital platform for the Hindu Maurya (Kushwaha) community fostering social connectivity, cultural preservation, and mutual support.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <Toaster />
            {children}
          </ToastProvider>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
