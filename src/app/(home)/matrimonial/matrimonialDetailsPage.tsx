"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { ArrowLeft, Crown, Heart } from "lucide-react";
import Link from "next/link";
import { Profile } from "@/src/features/searchProfile/type";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { format } from "date-fns";

type Props = {
  initialProfiles: Profile[];
};
interface AdPlacement {
  id: number;
  bannerImageUrl: string;
  link?: string;
  views: number;
  placementId: number;
  adUrl: string;
}

const VerticalAdSlider: React.FC<{ ads: AdPlacement[] }> = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [ads.length]);

  useEffect(() => {
    if (ads[currentIndex]) {
      fetch(`/api/ad-placements/${ads[currentIndex].id}`, { method: "POST" });
    }
  }, [currentIndex, ads]);

  if (ads.length === 0) {
    return (
      <div className="  w-full h-[350px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 text-center text-sm p-2">
        Ad Space (6) <br />
        (350x500 px)
      </div>
    );
  }

  return (
    <div className="relative w-full h-[350px]  rounded-2xl">
      {ads.map((ad, index) => (
        <div
          key={ad.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex
              ? "opacity-100 z-10"
              : "opacity-0 pointer-events-none z-0"
          }`}
        >
          <a
            href={ad.adUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            <Image
              src={ad.bannerImageUrl}
              alt={`Left Ad ${index + 1}`}
              width={350}
              height={500}
              className="w-full h-full object-cover shadow-lg rounded-2xl"
              priority={index === 0}
            />
          </a>
        </div>
      ))}

      {ads.length > 1 && (
        <>
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-20">
            {currentIndex + 1} / {ads.length}
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to ad ${index + 1}`}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Horizontal Ad Slider Component (Placement 7)
const HorizontalAdSlider: React.FC<{ ads: AdPlacement[] }> = ({ ads }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [ads.length]);

  useEffect(() => {
    if (ads[currentIndex]) {
      fetch(`/api/ad-placements/${ads[currentIndex].id}`, { method: "POST" });
    }
  }, [currentIndex, ads]);

  if (ads.length === 0) {
    return (
      <div className="mx-auto relative w-full max-w-[900px] h-[200px] sm:h-[250px] md:h-[300px]">
        <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl w-full h-full flex items-center justify-center text-center p-4">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-800">
              Book Your Ad (7)
            </h3>
            <span className="text-sm font-normal text-amber-700">
              Please select image size of (900x300 px)
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto relative w-full max-w-[900px]">
      <div className="bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border-4 border-amber-300 rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative p-4 sm:p-8 text-center h-[200px] sm:h-[250px] md:h-[300px]">
          {ads.map((ad, index) => (
            <div
              key={ad.id}
              className={`absolute inset-0 p-4 sm:p-8 transition-opacity duration-1000 ${
                index === currentIndex
                  ? "opacity-100 z-10"
                  : "opacity-0 pointer-events-none z-0"
              }`}
            >
              <a
                href={ad.adUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full h-full"
              >
                <Image
                  src={ad.bannerImageUrl}
                  alt={`Bottom Ad ${index + 1}`}
                  width={900}
                  height={300}
                  className="mx-auto rounded-xl shadow-lg w-full h-full object-contain"
                  priority={index === 0}
                />
              </a>
            </div>
          ))}

          {ads.length > 1 && (
            <>
              <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm z-20">
                {currentIndex + 1} / {ads.length}
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {ads.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex
                        ? "bg-amber-600 scale-125"
                        : "bg-amber-400/50 hover:bg-amber-400/75"
                    }`}
                    aria-label={`Go to ad ${index + 1}`}
                    type="button"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MatrimonialPage({ initialProfiles }: Props) {
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const [adPlacements, setAdPlacements] = useState<AdPlacement[]>([]);

  useEffect(() => {
    fetch("/api/ad-placements/approved")
      .then((res) => res.json())
      .then((data: AdPlacement[]) => {
        setAdPlacements(data);
      })
      .catch(() => console.error("Failed to load ad placements"));
  }, []);

  // Filter ads by placement
  const leftAds = adPlacements.filter((ad) => ad.placementId === 6);
  const bottomAds = adPlacements.filter((ad) => ad.placementId === 7);

  console.log("Left Ads (Placement 6):", leftAds);
  console.log("Bottom Ads (Placement 7):", bottomAds);

  // Responsive Carousel Logic
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [showGuidePopup, setShowGuidePopup] = useState(false);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(3);
      }
    };
    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  const totalSlides = Math.ceil(initialProfiles.length / itemsPerSlide);
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const start = currentIndex * itemsPerSlide;
  const visibleProfiles = initialProfiles.slice(start, start + itemsPerSlide);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Floating Guide Button */}
      <button
        onClick={() => setShowGuidePopup(true)}
        className="fixed left-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-3 py-2 rounded-r-lg shadow-lg hover:bg-red-700 z-50"
      >
        Guide
      </button>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
          <ArrowLeft className="h-4 w-4 text-red-600" />
          <Link href="/" className="text-red-600 hover:underline">
            Home
          </Link>
          <span>/</span>
          <span>Matrimonial Services</span>
        </div>
      </div>

      {/* Left Ad - hidden on small screens */}
      <div className=" absolute mt-36 left-6 z-40 w-72">
        <VerticalAdSlider ads={leftAds} />
      </div>

      {/* Header */}
      <div className="container mx-auto text-center mt-6 sm:mt-0 px-4">
        <Crown className="h-16 sm:h-20 w-16 sm:w-20 text-yellow-500 mx-auto" />
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg"></div>
          <h1 className="relative text-2xl sm:text-3xl md:text-4xl font-bold text-red-700">
            Maurya Matrimonial
          </h1>
        </div>
        <p className="text-base sm:text-lg text-red-600 max-w-2xl md:max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12">
          Find your perfect life partner within our respected Maurya community.
          Build a future together rooted in our shared values and heritage.
        </p>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 mb-12 ml-14">
        <div className="bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] shadow-xl rounded-lg p-6 sm:p-8 text-center text-white max-w-3xl lg:max-w-4xl mx-auto">
          <Heart className="h-12 sm:h-16 w-12 sm:w-16 mx-auto mb-4 text-white" />
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            Create Your Matrimonial Profile
          </h2>
          <p className="text-sm sm:text-lg mb-6 opacity-90">
            Join thousands of Maurya families who have found their perfect match
            through our platform
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Button
              asChild
              className="bg-white text-red-600 hover:bg-gray-100 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg font-semibold"
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? (
                <Link
                  href={
                    session?.user?.role === "admin" ||
                    session?.user?.role === "superAdmin"
                      ? "/admin/search-profile"
                      : "/dashboard/search-profile"
                  }
                >
                  Search Profile
                </Link>
              ) : (
                <Link href="/sign-in">Login To Search Profile</Link>
              )}
            </Button>
            <Button
              asChild
              className="bg-white text-red-600 hover:bg-gray-100 px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg font-semibold"
              disabled={!isAuthenticated}
            >
              {isAuthenticated ? (
                <Link
                  href={
                    session?.user?.role === "admin" ||
                    session?.user?.role === "superAdmin"
                      ? "/admin/create-profile"
                      : "/dashboard/create-profile"
                  }
                >
                  Create Profile Now
                </Link>
              ) : (
                <Link href="/sign-in">Login To Create Profile</Link>
              )}
            </Button>
          </div>
        </div>
      </div>

      <section className="py-8 bg-[#FFFDEF] px-4 sm:px-8">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#8B0000] mb-6">
            💍 Mauryavansham Matrimony
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed text-justify">
            Finding the right life partner within our own community has always
            been a cherished tradition. The Maurya Vansham Matrimony section is
            dedicated to helping families and individuals from the Kushwaha /
            Koiri / Sakhya / Sainy community connect with trust and confidence.
            This platform allows you to: ✅ Create and manage authentic
            matrimonial profiles ✅ Search and connect with verified community
            members ✅ Preserve cultural values while embracing modern
            matchmaking ✅ Build lifelong bonds rooted in trust, respect, and
            tradition.
            <br />
            <br />
            Every profile is verified by our Admin panel to ensure authenticity
            and community belonging. Our goal is not just to facilitate matches,
            but to strengthen relationships that uphold our heritage and unity.
            🌿 Begin your journey today — because marriages are not just between
            individuals, but between families and traditions.
          </p>
        </div>
      </section>

      {/* ✅ Success Stories */}
      <div className="container mx-auto px-4 pb-12 mt-12 sm:mt-20 relative">
        <div className="text-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-lg"></div>
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl font-bold text-red-700">
              Success Stories
            </h2>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          {/* Prev Button */}
          {initialProfiles.length > itemsPerSlide && (
            <button
              onClick={handlePrev}
              className="absolute -left-3 sm:left-0 bg-yellow-200 p-2 rounded-full hover:bg-yellow-300 transition"
            >
              {"<"}
            </button>
          )}

          {/* Cards */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${itemsPerSlide} gap-6 w-full`}
          >
            {visibleProfiles.map((profile) => (
              <Card
                key={profile.id}
                className="bg-yellow-50 border-yellow-200 hover:shadow-yellow-200 transition-shadow shadow-lg"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-red-700">{profile.name}</h3>
                    <p className="text-xs sm:text-sm text-red-600">
                      {profile.deactivateReason} in{" "}
                      {profile.updatedAt
                        ? format(new Date(profile.updatedAt), "dd MMM yyyy")
                        : ""}
                    </p>
                  </div>
                  <p className="text-gray-700 italic text-sm sm:text-base">
                    "{profile.deactivateReview}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Next Button */}
          {initialProfiles.length > itemsPerSlide && (
            <button
              onClick={handleNext}
              className="absolute -right-3 sm:right-0 bg-yellow-200 p-2 rounded-full hover:bg-yellow-300 transition"
            >
              {">"}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Ad */}
      <div className="mt-8 pb-12 px-4">
        <div className="container mx-auto">
          <HorizontalAdSlider ads={bottomAds} />
        </div>
      </div>

      {showGuidePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-yellow-50 w-11/12 sm:w-3/4 md:w-1/2 max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 relative">
            {/* Close button */}
            <button
              onClick={() => setShowGuidePopup(false)}
              className="absolute top-2 right-2 text-red-600 font-bold text-xl"
            >
              &times;
            </button>

            {/* Guide Section */}
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#8B0000] mb-6">
              Guide for Matrimony Service
            </h2>
            <h3 className="text-2xl sm:text-3xl font-semibold text-center text-red-700 mb-6">
              How It Works – Mauryavansham Matrimony
            </h3>

            <ol className="list-decimal list-inside space-y-4 text-gray-700 mb-8">
              <li>
                <strong>Register</strong>
                <p className="ml-4 mt-1">
                  Sign up by creating your matrimonial profile. Basic details
                  like name, age, family background, education, and preferences
                  are required.
                </p>
              </li>
              <li>
                <strong>Community Verification</strong>
                <p className="ml-4 mt-1">
                  Your profile will undergo triple verification by 3 Admin
                  Members to ensure authenticity and that you belong to the
                  Kushwaha / Koiri / Maurya / Sakhya / Sainy community.
                </p>
              </li>
              <li>
                <strong>Profile Approval</strong>
                <p className="ml-4 mt-1">
                  Once approved, your profile becomes visible in the Matrimony
                  Directory for other verified members to view.
                </p>
              </li>
              <li>
                <strong>Search & Connect</strong>
                <p className="ml-4 mt-1">
                  Browse verified profiles by filters such as age, education,
                  profession, or location. Each search result is
                  community-authenticated.
                </p>
              </li>
              <li>
                <strong>Express Interest</strong>
                <p className="ml-4 mt-1">
                  Send “Interest Requests” to families or individuals you would
                  like to connect with. The other side can accept, decline, or
                  request further details.
                </p>
              </li>
              <li>
                <strong>Secure & Respectful Communication</strong>
                <p className="ml-4 mt-1">
                  All communication is carried out respectfully through the
                  platform. Members are reminded to follow community ethics,
                  dignity, and mutual respect.
                </p>
              </li>
            </ol>

            {/* Matrimony Guidelines – Do’s & Don’ts */}
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#8B0000] mb-6">
              📌 Matrimony Guidelines – Do’s & Don’ts
            </h2>

            <p className="text-gray-700 mb-6 leading-relaxed text-justify">
              The Mauryavansham Matrimony section has been created with the sole
              aim of helping our community members find life partners in a safe
              and respectful environment. To ensure fairness, authenticity, and
              dignity, all members are requested to follow these guidelines:
            </p>

            {/* ✅ Do’s */}
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-semibold text-red-700 mb-4">
                ✅ Do’s
              </h3>
              <ol className="list-decimal list-inside space-y-4 text-gray-700">
                <li>
                  <strong>Provide Accurate Information</strong>
                  <p className="ml-4 mt-1">
                    Fill in your profile honestly with correct personal,
                    educational, and professional details.
                  </p>
                </li>
                <li>
                  <strong>Respect Privacy</strong>
                  <p className="ml-4 mt-1">
                    Share sensitive details (like contact numbers, addresses)
                    only after mutual trust and interest are established.
                  </p>
                </li>
                <li>
                  <strong>Parental/Family Involvement</strong>
                  <p className="ml-4 mt-1">
                    Wherever possible, involve your parents or elders in the
                    process to ensure clarity and transparency.
                  </p>
                </li>
                <li>
                  <strong>Be Respectful</strong>
                  <p className="ml-4 mt-1">
                    Communicate politely with other members and their families.
                    Mutual respect is the foundation of our community.
                  </p>
                </li>
                <li>
                  <strong>Report Misuse</strong>
                  <p className="ml-4 mt-1">
                    If you come across any suspicious or inappropriate activity,
                    immediately report it to the Admin team for quick action.
                  </p>
                </li>
              </ol>
            </div>

            {/* ❌ Don’ts */}
            <div className="mb-6">
              <h3 className="text-2xl sm:text-3xl font-semibold text-red-700 mb-4">
                ❌ Don’ts
              </h3>
              <ol className="list-decimal list-inside space-y-4 text-gray-700">
                <li>
                  <strong>Do Not Create Fake Profiles</strong>
                  <p className="ml-4 mt-1">
                    Misrepresentation of age, education, profession, or
                    community identity will lead to immediate removal.
                  </p>
                </li>
                <li>
                  <strong>Do Not Pressure or Harass</strong>
                  <p className="ml-4 mt-1">
                    Avoid sending repeated requests or offensive messages to
                    other members.
                  </p>
                </li>
                <li>
                  <strong>Do Not Share Irrelevant Content</strong>
                  <p className="ml-4 mt-1">
                    The Matrimony section is strictly for matrimonial purposes
                    only. Avoid business promotions, spam, or unrelated posts.
                  </p>
                </li>
                <li>
                  <strong>Do Not Circumvent the Platform</strong>
                  <p className="ml-4 mt-1">
                    Directly sharing personal details without consent is
                    discouraged. Use the platform’s secure communication options
                    first.
                  </p>
                </li>
                <li>
                  <strong>Do Not Misuse Community Trust</strong>
                  <p className="ml-4 mt-1">
                    Any attempt to exploit the platform for financial gain,
                    fraud, or non-community purposes will lead to a permanent
                    ban.
                  </p>
                </li>
              </ol>
            </div>

            {/* Enforcement */}
            <div className="mt-4 text-gray-700 font-medium">
              <p>
                ⚖ Enforcement: The Admin team reserves the right to verify,
                monitor, and moderate all activities. Profiles violating these
                guidelines may be suspended or permanently deleted without prior
                notice.
              </p>
              <p className="mt-2">
                🌿 Remember: Mauryavansham Matrimony is not just about finding a
                partner, but about building families, preserving traditions, and
                strengthening our community bonds.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
