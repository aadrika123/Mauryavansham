"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, Star, Crown, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// TypeScript interfaces
interface CarouselImage {
  id: number;
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
}

interface AdBannerProps {
  className?: string;
}

// Sample carousel images - replace with your actual images
// const carouselImages: CarouselImage[] = [
//   {
//     id: 1,
//     src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
//     alt: "Business Image 1"
//   },
//   {
//     id: 2,
//     src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
//     alt: "Business Image 2"
//   },
//   {
//     id: 3,
//     src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
//     alt: "Business Image 3"
//   },
//   {
//     id: 4,
//     src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
//     alt: "Business Image 4"
//   }
// ];
const carouselImages: CarouselImage[] = [
  {
    src: "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754133157/Gemini_Generated_Image_pe53ibpe53ibpe53_ot4dkc.png",
    alt: "Ancient Maurya Empire Art",
    id: 1,
  },
  {
    src: "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754130857/chandragup_maur_vmo5vb.png",
    alt: "Lord Ram Temple Ayodhya",
    id: 2,
  },
  {
    src: "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754130857/samrat_ashoka_hekb0f.png",
    alt: "Ashoka Pillar in Ancient India",
    id: 3,
  },
  {
    src: "https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754130857/mauras_kuswahas_rjabks.png",
    alt: "Indian Family Celebration",
    id: 4,
  },
  // {
  //   src: "/images/indian-community-gathering.png",
  //   alt: "Large Indian Community Gathering",
  // },
];

// Image Carousel Component
const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const goToPrevious = (): void => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Image Container */}
      <div className="relative h-[400px] sm:h-[400px] md:h-[400px] lg:h-[450px] overflow-hidden">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentIndex
                ? "translate-x-0"
                : index < currentIndex
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover object-center" // Ensures image is centered and not cut
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 group"
          aria-label="Previous image"
          type="button"
        >
          <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 group"
          aria-label="Next image"
          type="button"
        >
          <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>

      {/* Image Counter */}
      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
};

// Ad Banner Component
const AdBanner: React.FC<AdBannerProps> = ({ className = "" }) => (
  <div className={`sticky top-6 ${className}`}>
    <div className="bg-gradient-to-b from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 h-96">
      <div className="relative p-4 h-full">
        {/* Decorative Elements */}
        <div className="absolute top-3 left-3">
          <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
        </div>
        <div className="absolute top-3 right-3">
          <Star className="h-6 w-6 text-amber-500 animate-pulse" />
        </div>
        <div className="absolute bottom-3 left-3">
          <Star className="h-5 w-5 text-amber-400" />
        </div>
        <div className="absolute bottom-3 right-3">
          <Sparkles className="h-5 w-5 text-amber-400" />
        </div>

        {/* Book Pages Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-20"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center">
          <div className="border-2 border-dashed border-amber-400 rounded-lg p-4 bg-gradient-to-br from-amber-50 to-yellow-100 h-full flex flex-col justify-center">
            <h3 className="text-lg font-bold text-amber-800 mb-3 text-center">
              Book Your Ad
            </h3>

            <div className="space-y-3 flex-1 flex flex-col justify-center">
              <p className="text-xs text-amber-700 leading-relaxed text-center">
                Premium vertical space for your business
              </p>

              <div className="space-y-2">
                <button
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-2 px-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 text-xs"
                  type="button"
                >
                  Place Ad Here
                </button>

                <p className="text-xs text-amber-600 text-center">
                  Contact us for this premium vertical space
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Border Pattern */}
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-400"></div>
        <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-400"></div>
      </div>
    </div>
  </div>
);

// Mobile Ad Banner Component
const MobileAdBanner: React.FC = () => (
  <div className="lg:hidden mt-8">
    <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="relative p-6">
        {/* Decorative Elements */}
        <div className="absolute top-3 left-3">
          <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
        </div>
        <div className="absolute top-3 right-3">
          <Star className="h-6 w-6 text-amber-500 animate-pulse" />
        </div>

        {/* Book Pages Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>

        {/* Content */}
        <div className="text-center relative z-10">
          <div className="border-2 border-dashed border-amber-400 rounded-lg p-4 bg-gradient-to-br from-amber-50 to-yellow-100">
            <h3 className="text-xl font-bold text-amber-800 mb-3">
              Book Your Ad
            </h3>

            <div className="space-y-3">
              <button
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 text-sm"
                type="button"
              >
                Place Your Ad Here
              </button>

              <p className="text-xs text-amber-600">
                Contact us to feature your message in this premium space
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Border Pattern */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
      </div>
    </div>
  </div>
);

// Main Hero Section Component
const HeroSection: React.FC = () => {
  return (
    <section className="relative text-white py-10 overflow-hidden">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000] via-[#FF5C00] to-[#ffae00]" />

      {/* Crown Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Crown className="absolute top-10 left-10 w-16 h-16 text-white/20 transform rotate-12" />
        <Crown className="absolute top-32 right-20 w-20 h-20 text-white/20 transform -rotate-12" />
        <Crown className="absolute bottom-20 left-20 w-12 h-12 text-white/20 transform rotate-45" />
        <Crown className="absolute bottom-32 right-10 w-16 h-16 text-white/20 transform -rotate-45" />
        <Crown className="absolute top-1/2 left-1/4 w-8 h-8 text-white/20 transform rotate-90" />
        <Crown className="absolute top-1/3 right-1/3 w-10 h-10 text-white/20 transform -rotate-90" />
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex gap-2 items-start">
          {/* Left Ad Banner */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <AdBanner />
          </div>

          {/* Main Content - Image Carousel */}
          <div className="flex-1 flex justify-center">
            <ImageCarousel images={carouselImages} />
          </div>

          {/* Right Ad Banner */}
          <div className="hidden lg:block w-56 flex-shrink-0">
            <AdBanner />
          </div>
        </div>

        {/* Mobile Ad Banner */}
        <MobileAdBanner />
      </div>
    </section>
  );
};

export default HeroSection;
