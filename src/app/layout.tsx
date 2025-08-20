'use client';
// app/layout.tsx
import "../../styles/globals.css";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { Footer } from "../components/layout/footer";
import { Toaster } from "../components/ui/toaster";
import SessionTimeout from "../components/SessionTimeout"; // 👈 import

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <SessionTimeout>
              <Toaster />
              {children}
            </SessionTimeout>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
