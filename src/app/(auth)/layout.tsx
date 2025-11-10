import type { Metadata } from "next";
import { headers } from "next/headers";
// import MobileLayoutClient from "./MobileLayoutClient"; // 👈 client component
import MobileLayout from "./mobileViewLayout";
import AuthLayout from "./webVeiwLayout";
import MobileLayoutClient from "./MobileLayoutClient";

export const metadata: Metadata = {
  title: "Mauryavansham - Hindu Maurya Community Portal",
  description:
    "A comprehensive digital platform for the Hindu Maurya (Kushwaha) community fostering social connectivity, cultural preservation, and mutual support.",
};

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

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {isMobile ? (
          // 👇 Client-side wrapper for auto reload
          <MobileLayoutClient>
            <MobileLayout>{children}</MobileLayout>
          </MobileLayoutClient>
        ) : (
          <AuthLayout>{children}</AuthLayout>
        )}
      </body>
    </html>
  );
}
