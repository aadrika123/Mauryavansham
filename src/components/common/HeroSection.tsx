'use client';
import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Crown, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import Image from 'next/image';
import Loader from '../ui/loader';

// TypeScript interfaces
interface CarouselImage {
  id: number;
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
}

interface AdPlacement {
  id: number;
  bannerImageUrl: string;
  link?: string;
  views: number;
  placementId: number;
  adUrl: string;
}

// Sample carousel images
const carouselImages: CarouselImage[] = [
  {
    id: 1,
    src: 'https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754133157/Gemini_Generated_Image_pe53ibpe53ibpe53_ot4dkc.png',
    alt: 'Ancient Maurya Empire Art'
  },
  {
    id: 2,
    src: 'https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754130857/chandragup_maur_vmo5vb.png',
    alt: 'Lord Ram Temple Ayodhya'
  },
  {
    id: 3,
    src: 'https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754130857/samrat_ashoka_hekb0f.png',
    alt: 'Ashoka Pillar in Ancient India'
  },
  {
    id: 4,
    src: 'https://res.cloudinary.com/dgwhhrsfh/image/upload/v1754130857/mauras_kuswahas_rjabks.png',
    alt: 'Indian Family Celebration'
  }
];

// Image Carousel Component
const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const goToPrevious = (): void => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = (): void => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="relative h-[400px] sm:h-[400px] md:h-[400px] lg:h-[450px] overflow-hidden">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
              index === currentIndex ? 'translate-x-0' : index < currentIndex ? '-translate-x-full' : 'translate-x-full'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className=" object-fill"
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
                index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>

        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

// Ad Slider Component for Multiple Ads
const AdSlider: React.FC<{
  ads: AdPlacement[];
  position: 'left' | 'right';
}> = ({ ads, position }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ads.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(timer);
  }, [ads.length]);

  // Track view when ad changes
  useEffect(() => {
    if (ads[currentIndex]) {
      fetch(`/api/ad-placements/${ads[currentIndex].id}`, { method: 'POST' });
    }
  }, [currentIndex, ads]);

  if (ads.length === 0) {
    return (
      <div className="w-full h-[450px] text-center bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
        Ad Space ({position === 'left' ? '1' : '2'}) <br />
        Please select image size of (350 x 500 pixels)
      </div>
    );
  }

  return (
    <div className="relative w-full h-[450px] overflow-hidden rounded-2xl">
      {ads.map((ad, index) => (
        <div
          key={ad.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
          }`}
        >
          <a href={ad.adUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <Image
              src={ad.bannerImageUrl}
              alt={`${position} Ad ${index + 1}`}
              width={350}
              height={500}
              className="w-full h-full object-fill shadow-lg"
              priority={index === 0}
            />
          </a>
        </div>
      ))}

      {/* Ad Counter - only show if multiple ads */}
      {ads.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-10">
          {currentIndex + 1} / {ads.length}
        </div>
      )}

      {/* Navigation Dots - only show if multiple ads */}
      {ads.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to ad ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Mobile Ad Banner Component with Slider
const MobileAdBanner: React.FC<{ adPlacements: AdPlacement[] }> = ({ adPlacements }) => {
  const leftAds = adPlacements.filter(ad => ad.placementId === 1);
  const rightAds = adPlacements.filter(ad => ad.placementId === 2);

  return (
    <div className="lg:hidden mt-8 flex flex-col gap-4">
      {leftAds.length > 0 && <AdSlider ads={leftAds} position="left" />}
      {rightAds.length > 0 && <AdSlider ads={rightAds} position="right" />}
    </div>
  );
};

// Main Hero Section Component
const HeroSection: React.FC = () => {
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ad-placements/approved')
      .then(res => res.json())
      .then((data: AdPlacement[]) => {
        setAdPlacements(data);
        setLoading(false);
      })
      .catch(() => {
        console.error('Failed to load ad placements');
        setLoading(false);
      });
  }, []);

  const leftAds = adPlacements.filter(ad => ad.placementId === 1);
  const rightAds = adPlacements.filter(ad => ad.placementId === 2);

  console.log('Left Ads:', leftAds);
  console.log('Right Ads:', rightAds);
  console.log('All adPlacements:', adPlacements);

  return (
    <section className="relative text-white py-10 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000] via-[#FF5C00] to-[#ffae00]" />

      {/* Crown Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Crown className="absolute top-10 left-10 w-20 h-20 text-white/20 transform rotate-12" />
        <Crown className="absolute top-32 right-20 w-32 h-32 text-white/20 transform -rotate-12" />
        <Crown className="absolute bottom-20 left-20 w-12 h-12 text-white/20 transform rotate-45" />
        <Crown className="absolute bottom-32 right-10 w-16 h-16 text-white/20 transform -rotate-45" />
        <Crown className="absolute top-1/2 left-1/4 w-8 h-8 text-white/20 transform rotate-90" />
        <Crown className="absolute top-1/3 right-1/3 w-10 h-10 text-white/20 transform -rotate-90" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex gap-2 items-start">
          {/* Left Ad Banner with Slider */}
          <div className="hidden lg:block w-[20rem] flex-shrink-0 relative">
            {loading ? <Loader /> : <AdSlider ads={leftAds} position="left" />}
          </div>

          {/* Main Carousel */}
          <div className="flex-1">
            <ImageCarousel images={carouselImages} />
          </div>

          {/* Right Ad Banner with Slider */}
          <div className="hidden lg:block w-[20rem] flex-shrink-0">
            {loading ? <Loader /> : <AdSlider ads={rightAds} position="right" />}
          </div>
        </div>

        {/* Mobile Ad Banner */}
        <MobileAdBanner adPlacements={adPlacements} />
      </div>
    </section>
  );
};

export default HeroSection;
