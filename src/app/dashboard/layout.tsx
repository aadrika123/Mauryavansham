import type { Metadata } from "next";
import { headers } from "next/headers";
import MobileViewLayout from "./mobileViewLayout";
import WebViewLayout from "./webVeiwLayout";

export const metadata: Metadata = {
  title: "Mauryavansham - Hindu Maurya Community Portal",
  description:
    "A comprehensive digital platform for the Hindu Maurya (Kushwaha) community fostering social connectivity, cultural preservation, and mutual support.",
};

function isMobileDevice(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(userAgent);
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
          <MobileViewLayout>{children}</MobileViewLayout>
        ) : (
          <WebViewLayout>{children}</WebViewLayout>
        )}
      </body>
    </html>
  );
}
