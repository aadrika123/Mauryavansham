"use client";

import { useEffect, useState } from "react";
import { FeaturesSection } from "@/src/components/common/FeaturesSection";
import { CommunityStatsSection } from "@/src/components/common/CommunityStatsSection";
import { CulturalHeritageSection } from "@/src/components/common/CulturalHeritageSection";
import HeroSection from "@/src/components/common/HeroSection";
import MauryavanshamApp from "@/src/components/common/mobileHomePage";

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // ✅ Detect if it's mobile based on screen width
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile(); // initial check
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (isMobile) {
    // ✅ Render only mobile view
    return <MauryavanshamApp />;
  }

  // ✅ Render normal web layout
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <CommunityStatsSection />
      <CulturalHeritageSection />
    </div>
  );
}
