import type { Metadata } from "next";
import { headers } from "next/headers";
import MobileViewLayout from "./mobileViewLayout";
import WebViewLayout from "./webVeiwLayout";

export const metadata: Metadata = {
  title: "Mauryavansham - Hindu Maurya Community Portal",
  description:
    "A comprehensive digital platform for the Hindu Maurya (Kushwaha) community fostering social connectivity, cultural preservation, and mutual support.",
};

// ✅ Improved user-agent detection (works for browsers + native WebViews)
function isMobileDevice(userAgent: string | null): boolean {
  if (!userAgent) return false;

  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Mobile Safari|MauryaApp/i;

  return mobileRegex.test(userAgent);
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const userAgent = headerList.get("user-agent");
  const isMobile = isMobileDevice(userAgent);

  // Optional: log to verify (remove in production)
  console.log("📱 User-Agent:", userAgent, "→ Detected Mobile:", isMobile);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {isMobile ? (
          <MobileViewLayout>{children}</MobileViewLayout>
        ) : (
          <WebViewLayout>{children}</WebViewLayout>
        )}
      </body>
    </html>
  );
}
