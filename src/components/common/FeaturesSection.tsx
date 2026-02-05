'use client';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card';
import {
  Users,
  Heart,
  ShoppingBag,
  Calendar,
  HandHeart,
  Trophy,
  Sparkles,
  Star,
  Eye,
  Crown,
  User,
  Lock,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
// import "keen-slider/keen-slider.min.css";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AdPlacement {
  id: number;
  bannerImageUrl: string;
  link?: string;
  views: number;
  placementId: number;
  adUrl: string;
}

// Ad Slider Component for Horizontal Ads (Placement 3)
const HorizontalAdSlider: React.FC<{ ads: AdPlacement[] }> = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
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
      <div className="mx-auto relative w-full max-w-[900px] h-[180px] sm:h-[220px] md:h-[300px]">
        <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 w-full h-full">
          <div className="relative p-4 sm:p-6 md:p-8 w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
            <div className="text-center relative z-10 flex flex-col justify-center items-center h-full">
              <div className="relative border-2 border-dashed border-amber-400 rounded-lg p-4 sm:p-6 md:p-8 bg-gradient-to-br from-amber-50 to-yellow-100 w-full">
                <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-amber-800 mb-4">
                  Book Your Ad (3) <br />
                  <p className="text-xs sm:text-sm">
                    (Recommended size: 900x300px)
                  </p>
                </h3>
                <div className="space-y-4 relative">
                  <div className="absolute top-4 left-4">
                    <Sparkles className="h-5 sm:h-6 md:h-8 w-5 sm:w-6 md:w-8 text-amber-500 animate-pulse" />
                  </div>
                  <div className="absolute top-4 right-4">
                    <Star className="h-5 sm:h-6 md:h-8 w-5 sm:w-6 md:w-8 text-amber-500 animate-pulse" />
                  </div>
                  <p className="text-xs sm:text-sm text-amber-600 mt-2">
                    Go to your dashboard to create and manage ads.
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[900px] mx-auto h-[180px] sm:h-[220px] md:h-[300px]">
      <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 w-full h-full">
        <div className="relative p-4 sm:p-6 md:p-8 w-full h-full">
          {/* Ad Images */}
          {ads.map((ad, index) => (
            <div
              key={ad.id}
              className={`absolute inset-0  transition-opacity duration-1000 ${
                index === currentIndex
                  ? 'opacity-100 z-10'
                  : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              <a
                href={ad.adUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full h-full"
              >
                <img
                  src={ad.bannerImageUrl}
                  alt={`Ad ${index + 1}`}
                  className="mx-auto rounded-xl shadow-lg w-full h-full object-fill"
                />
              </a>
            </div>
          ))}

          {/* Ad Counter - only show if multiple ads */}
          {ads.length > 1 && (
            <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-20">
              {currentIndex + 1} / {ads.length}
            </div>
          )}

          {/* Navigation Dots - only show if multiple ads */}
          {ads.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-amber-600 scale-125'
                      : 'bg-amber-400/50 hover:bg-amber-400/75'
                  }`}
                  aria-label={`Go to ad ${index + 1}`}
                  type="button"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function FeaturesSection() {
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);
  const { data: session } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    fetch('/api/ad-placements/approved')
      .then((res) => res.json())
      .then((data: AdPlacement[]) => {
        setAdPlacements(data);
      })
      .catch(() => console.error('Failed to load ad placements'));
  }, []);

  // Filter ads for placement 3 (horizontal banner)
  const horizontalAds = adPlacements.filter((ad) => ad.placementId === 3);

  console.log('Horizontal Ads (Placement 3):', horizontalAds);

  const features = [
    {
      icon: Eye,
      title: 'Know your community members',
      description: 'See who is available in the community',
      href: '/community-directory'
    },
    {
      icon: Eye,
      title: 'Heritage ',
      description: 'Know about your community’s history',
      href: '/heritage'
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with fellow Maurya community members worldwide',
      href: '/community'
    },
    {
      icon: Heart,
      title: 'Matrimonial',
      description: 'Find your perfect life partner within the community',
      href: '/matrimonial'
    },
    {
      icon: Calendar,
      title: 'Events & Calendar',
      description: 'Stay updated with community events and celebrations',
      href: '/events'
    },
    {
      title: 'Business Forum',
      icon: ShoppingBag,
      description: 'Promote your business and connect with potential clients',
      href: '/business'
    },

    {
      icon: HandHeart,
      title: 'Health & Wellness',
      description: 'Access health resources and support within the community',
      href: '/health-wellness'
    },
    {
      icon: Sparkles,
      title: 'Educations',
      description: 'Explore educational resources and opportunities',
      href: '/education'
    },
    {
      icon: Trophy,
      title: 'Achievements',
      description: 'Showcase and celebrate community achievements',
      href: '/achievements'
    },
    {
      icon: Sparkles,
      title: 'Blogs',
      description: 'Read and share articles on community topics',
      href: '/blogs'
    },
    {
      icon: Sparkles,
      title: 'Donations',
      description: 'Support community initiatives through donations',
      href: '/'
    }
  ];

  return (
    <>
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Login Required
              </h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Please login to access the Community Directory.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => Router.push('/sign-in')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button
                onClick={() => setShowLoginModal(false)}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <section className="py-8 bg-[#FFFDEF] px-4 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#8B0000] mb-6">
            Welcome to Mauryavansham.com
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed text-justify">
            MauryaVansham.com is an{' '}
            <strong>exclusive community platform</strong> created by and for
            members of the{' '}
            <strong>Kushwaha / Koiri / Maurya / Sakhya / Sainy</strong>{' '}
            community. Designed, developed, maintained and hosted by{' '}
            <strong>Aadrika Enterprises</strong>, whose Promoters proudly belong
            to the same community, this portal has been built with a{' '}
            <strong>pure motive of community development and unity</strong> –
            not for profit, but for growth, support, and heritage preservation.
          </p>

          <div className="text-justify space-y-3">
            {[
              'Connect with fellow community members across cities and states',
              'Explore the Community Directory and discover businesses, professionals, and families',
              'Find and share opportunities through our Business & Matrimonial sections',
              'Showcase achievements, preserve family lineage, and strengthen cultural bonds',
              'Support and grow together through peer-to-peer collaboration'
            ].map((point, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-yellow-600 text-xl">
                  <Crown />
                </span>
                <p className="text-gray-700">{point}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-lg font-medium text-[#8B4513] text-justify">
            Together, let us build a stronger, more connected, and empowered
            Maurya Vansh community.
          </p>
        </div>
      </section>

      <section className="py-10 bg-[#FFFDEF] px-4 sm:px-8">
        <div className="container mx-auto px-4 sm:px-8 py-2 w-full md:w-5/6">
          {/* Horizontal Ad Slider for Placement 3 */}
          <HorizontalAdSlider ads={horizontalAds} />
        </div>

        {/* Community Section */}
        <div className="container mx-auto px-4 mt-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#8B0000]">
              Community Services
            </h2>
            <p className="text-[#8B4513] max-w-2xl mx-auto">
              Strengthening our Maurya community through digital connectivity,
              preserving our heritage, and fostering meaningful relationships
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const isCommunityDirectory =
                feature.href === '/community-directory';
              const isDisabled =
                feature.href === '/' || (isCommunityDirectory && !session);

              return (
                <Card
                  key={index}
                  className="hover:shadow-[#ffd500] hover:shadow-lg bg-[#FFF8DE] border border-[#FFF6D5]"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <feature.icon className="h-6 w-6 text-orange-600" />
                      </div>
                      <CardTitle className="text-lg text-[#8B0000]">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {feature.description}
                    </CardDescription>
                    <div className="flex flex-col items-start gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (isCommunityDirectory && !session) {
                            setShowLoginModal(true);
                          } else if (!isDisabled) {
                            Router.push(feature.href);
                          }
                        }}
                        className={'text-orange-600'}
                        disabled={feature.href === '/'}
                      >
                        {feature.href === '/' ? 'Coming Soon' : 'Learn More'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
