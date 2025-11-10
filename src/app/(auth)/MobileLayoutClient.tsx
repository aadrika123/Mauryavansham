"use client";

import { useEffect } from "react";

export default function MobileLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reloaded = sessionStorage.getItem("mobileReloaded");
    if (!reloaded) {
      sessionStorage.setItem("mobileReloaded", "true");
      window.location.reload();
    }
  }, []);

  return <>{children}</>;
}
