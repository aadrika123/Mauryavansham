import { HeroSection } from "@/src/components/common/HeroSection"
import { FeaturesSection } from "@/src/components/common/FeaturesSection"
import { CommunityStatsSection } from "@/src/components/common/CommunityStatsSection"
import { CulturalHeritageSection } from "@/src/components/common/CulturalHeritageSection"
import { Header } from "../../components/layout/header"
import { Footer } from "../../components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* <Header /> */}
      <HeroSection />
      <FeaturesSection />
      <CommunityStatsSection />
      <CulturalHeritageSection />
      {/* <Footer /> */}
    </div>
  )
}
