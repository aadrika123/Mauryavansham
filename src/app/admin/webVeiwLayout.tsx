"use client";
import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/src/components/theme-provider";
// import { ToastProvider } from "@/src/components/ui/ToastProvider";
import { Toaster } from "@/src/components/ui/toaster";
import { ToastProvider } from "@/src/components/ui/toastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mauryavansham - Hindu Maurya Community Portal",
  description:
    "A comprehensive digital platform for the Hindu Maurya (Kushwaha) community fostering social connectivity, cultural preservation, and mutual support.",
};

export default function Adminlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* Wrap children in ToastProvider */}
          <ToastProvider>
            <Toaster /> {/* optional: your existing toaster */}
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
