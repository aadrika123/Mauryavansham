'use client';
import "../../styles/globals.css";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { Footer } from "../components/layout/footer";
import { Toaster } from "../components/ui/toaster";
import SessionTimeout from "../components/SessionTimeout"; 
import Script from "next/script"; 
import { usePathname } from "next/navigation"; // ✅ import

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); // ✅ get current route

  const hideFooter = pathname.startsWith("/admin"); 

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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

        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <SessionTimeout>
              {children}
              <Toaster />
            </SessionTimeout>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
