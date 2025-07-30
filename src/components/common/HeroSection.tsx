import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { ImageCarousel } from "@/src/components/image-carousel"

export function HeroSection() {
  const carouselImages = [
    { src: "/images/maurya-empire-art.png", alt: "Ancient Maurya Empire Art" },
    { src: "/images/lord-ram-temple.png", alt: "Lord Ram Temple Ayodhya" },
    { src: "/images/ashoka-pillar.png", alt: "Ashoka Pillar in Ancient India" },
    {
      src: "/images/indian-family-celebration.png",
      alt: "Indian Family Celebration",
    },
    {
      src: "/images/indian-community-gathering.png",
      alt: "Large Indian Community Gathering",
    },
  ]

  return (
    <section className="relative text-white py-24 md:py-32 lg:py-40 overflow-hidden">
      <ImageCarousel images={carouselImages} />
      <div
        className="absolute inset-0 bg-gradient-to-r to-[#ffae00] via-[#FF5C00] from-[#8B0000] text-white"
        aria-hidden="true"
      ></div>{" "}
      {/* Overlay for text readability */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">The Royal Heritage of Maurya Community</h1>
          <p className="text-xl mb-8 opacity-90">
            Descendants of Lord Ram, inheritors of Samrat Chandragupta Maurya's legacy, and followers of Samrat Ashoka's
            wisdom. Join our proud community portal connecting Mauryas and Kushwahas across the globe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100" asChild>
              <Link href="/registration">Join Community</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-orange-600 bg-transparent"
              asChild
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
