"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useSession } from "next-auth/react";
import { Lock, User, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  isActive: boolean;
  status: string;
  deactivationReason?: string;
  deactivatedReason?: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
}
interface Props {
  user?: User;
}
export default function BusinessDetailsPage({ user }: Props) {
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [carouselIndexes, setCarouselIndexes] = useState<number[]>([]);
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setCurrentUser(session.user);
    }
  }, [session]);

  console.log(user, "currentUser");

  const categories = [
    "Health & Beauty",
    "Apparel & Fashion",
    "Chemicals",
    "Machinery",
    "Construction & Real Estate",
    "Electronics & Electrical",
    "Hospital & Medical",
    "Gifts & Crafts",
    "Packaging & Paper",
    "Agriculture",
    "Home Supplies",
    "Minerals & Metals",
    "Industrial Supplies",
    "Pipes, Tubes & Fittings",
  ];

  // Fetch businesses
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await fetch("/api/register-business");
        const json = await res.json();
        if (json.success) {
          setBusinesses(json.data);
        }
      } catch (err) {
        console.error("Error fetching businesses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  // Initialize carousel indexes when businesses are loaded
  useEffect(() => {
    if (businesses.length > 0) {
      setCarouselIndexes(businesses.map(() => 0));
    }
  }, [businesses]);

  const badgeColors: Record<string, string> = {
    Premium: "bg-yellow-400 text-black",
    Gold: "bg-yellow-600 text-white",
    Silver: "bg-gray-300 text-black",
    Basic: "bg-blue-200 text-black",
  };

  // Carousel navigation
  const nextSlide = (index: number) => {
    setCarouselIndexes((prev) =>
      prev.map((val, i) =>
        i === index
          ? (val + 1) % (businesses[i].businesses?.photos?.product.length || 1)
          : val
      )
    );
  };

  const prevSlide = (index: number) => {
    setCarouselIndexes((prev) =>
      prev.map((val, i) =>
        i === index
          ? (val -
              1 +
              (businesses[i].businesses?.photos?.product.length || 1)) %
            (businesses[i].businesses?.photos?.product.length || 1)
          : val
      )
    );
  };
  const handleEnquiry = async (business: any) => {
    console.log("Enquiry clicked for business:", business);
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const message = `${user.name} from ${user.city} ${user.state} (${user.email}) wants to connect with you regarding your registered product.`;

    // 1️⃣ Send notification
    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessOwnerId: business.businesses.userId,
        type: "business_enquiry",
        message,
        currentUser: user,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Enquiry sent successfully!");

      // 2️⃣ Only after notification success, send email
      await fetch("/api/send-business-enquiry-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessOwnerEmail: business?.users?.email,
          // businessOwnerEmail: "akshay.aadrika@gmail.com",
          currentUser: user,
        }),
      });
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="flex gap-6 p-6 bg-yellow-50 min-h-screen">
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
              Please login to participate in community discussions and create
              new topics.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => Router.push("/sign-in")}
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

      {/* Left Sidebar */}
      <div className="hidden lg:block w-60">
        <Card className="p-4 shadow-md hover:shadow-[#ffd500] hover:shadow-lg bg-[#FFF8DE] border border-[#FFF6D5]">
          <h2 className="text-lg font-bold mb-3 text-red-700">
            Top Categories
          </h2>
          <ul className="space-y-2 text-gray-700">
            {categories.map((cat, i) => (
              <li
                key={i}
                className="hover:text-blue-600 cursor-pointer text-sm"
              >
                {cat}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-red-700 underline text-sm cursor-pointer">
            View all Categories
          </p>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Banner / Hero */}
        <div className="w-full h-56 bg-orange-200 rounded-2xl mb-6 flex items-center justify-center">
          <h2 className="text-xl font-bold text-red-700">Hero Banner / Ads</h2>
        </div>

        <h2 className="text-xl font-bold text-red-700 mb-6">
          Premium Business Listings
        </h2>

        <div className="space-y-6">
          {businesses.map((biz, i) => {
            const images = biz.businesses?.photos?.product || [];
            const current = carouselIndexes[i] || 0;

            return (
              <Card
                key={i}
                className="relative shadow-lg bg-white border border-yellow-200 "
              >
                {/* Premium Badge at Card Top-Left */}
                {biz.businesses?.premiumCategory && (
                  <div
                    className={`absolute top-2 left-2 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 z-10 ${
                      badgeColors[biz.businesses?.premiumCategory] ||
                      "bg-gray-200"
                    }`}
                  >
                    👑 {biz.businesses.premiumCategory}
                  </div>
                )}

                <CardContent className="p-6 grid grid-cols-3 ">
                  {/* Left Column */}
                  <div className="flex flex-col items-center">
                    {images.length === 1 ? (
                      <img
                        src={images[0]}
                        alt="business"
                        className="w-40 h-40 object-cover rounded border"
                      />
                    ) : images.length > 1 ? (
                      <div className="relative w-48 h-48">
                        <img
                          src={images[current]}
                          alt={`business-${current}`}
                          className="w-48 h-48 object-cover rounded border"
                        />
                        <button
                          onClick={() => prevSlide(i)}
                          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white px-1 rounded"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => nextSlide(i)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white px-1 rounded"
                        >
                          ›
                        </button>
                      </div>
                    ) : (
                      <div className="w-40 h-40 flex items-center justify-center border rounded bg-gray-100 text-xs text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Middle Column */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {biz.businesses?.organizationName}
                      </h3>
                      <p className="text-sm text-gray-600">{biz.users?.name}</p>
                      <div className="mt-2">
                        <p className="text-sm font-medium">Category:</p>
                        <p className="text-sm text-gray-700">
                          {biz.businesses?.businessCategory}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-1">
                        Enquiry
                      </Button> */}
                      <Button
                        onClick={() => handleEnquiry(biz)}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                      >
                        Enquire
                      </Button>

                      {/* <Button className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-4 py-1">
                        Know More
                      </Button> */}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    {biz.businesses?.businessDescription && (
                      <>
                        <p className="text-sm font-medium">Description:</p>
                        <p className="text-sm text-gray-700">
                          {biz.businesses.businessDescription}
                        </p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Company Information */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 mt-6 border border-[#FFF6D5]">
          <h3 className="text-lg font-semibold mb-3 text-red-700">
            Why Choose Our Platform?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-semibold mb-2">Verified Suppliers</h4>
              <p className="text-sm text-gray-600">
                All suppliers are verified and trusted for quality assurance
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🚀</div>
              <h4 className="font-semibold mb-2">Fast Delivery</h4>
              <p className="text-sm text-gray-600">
                Quick processing and delivery across India
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">💰</div>
              <h4 className="font-semibold mb-2">Best Prices</h4>
              <p className="text-sm text-gray-600">
                Competitive pricing with bulk order discounts
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden lg:block w-64 space-y-4">
        <Card className="p-4 transition-shadow hover:shadow-[#ffd500] hover:shadow-lg bg-[#FFF8DE] border border-[#FFF6D5] shadow-lg">
          <h4 className="font-semibold text-red-700 mb-2">
            Looking for a Product?
          </h4>
          <p className="text-xs text-gray-600 mb-3">
            Post your requirements and get quotes from verified suppliers
          </p>
          <Button className="w-full bg-red-700 text-white hover:bg-red-800 text-sm py-2">
            Post Buy Requirement
          </Button>
        </Card>
        <Card className="p-4 transition-shadow hover:shadow-[#ffd500] hover:shadow-lg bg-[#FFF8DE] border border-[#FFF6D5] shadow-lg">
          <h4 className="font-semibold text-red-700 mb-2">
            Grow Your Business 10X Faster
          </h4>
          <p className="text-xs text-gray-600 mb-3">
            Join thousands of sellers on our platform
          </p>
          <Button className="w-full bg-red-700 text-white hover:bg-red-800 text-sm py-2">
            Sell on Platform
          </Button>
        </Card>
      </div>
    </div>
  );
}
