"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Lock, User, X, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HealthAndWellnessPage({ user }: any) {
  const [loading, setLoading] = useState(false);
  const [centers, setCenters] = useState<any[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<any[]>([]);
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const Router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<any>(null);

  useEffect(() => {
    if (session?.user) setCurrentUser(session.user);
  }, [session]);

  const handleKnowMore = (center: any) => {
    setSelectedCenter(center);
    setShowDetailsModal(true);
  };

  // Fetch active health & wellness centers
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await fetch("/api/health-services");
        const json = await res.json();
        if (json.success) {
          setCenters(json.data);
          setFilteredCenters(json.data);
        }
      } catch (err) {
        console.error("Error fetching centers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return setFilteredCenters(centers);
    const term = searchTerm.toLowerCase();
    const filtered = centers.filter(
      (center) =>
        center.centerName?.toLowerCase().includes(term) ||
        center.category?.toLowerCase().includes(term) ||
        center.ownerName?.toLowerCase().includes(term) ||
        center.city?.toLowerCase().includes(term) ||
        center.state?.toLowerCase().includes(term) ||
        center.offerings?.some((o: string) => o.toLowerCase().includes(term))
    );
    setFilteredCenters(filtered);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredCenters(centers);
  };

  const openImageModal = (images: string[], index: number) => {
    setModalImages(images);
    setModalIndex(index);
    setShowImageModal(true);
  };

  // 🔹 Handle Enquiry
  const handleEnquiry = async (center: any) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const message = `${user.name} from ${user.city || ""} ${user.state || ""} (${user.email}) wants to connect with you regarding your registered health/wellness service.`;

    // 1️⃣ Send notification (optional)
    const notifyRes = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessOwnerId: center.userId,
        type: "health_enquiry",
        message,
        currentUser: user,
      }),
    });

    // 2️⃣ Send email
    const emailRes = await fetch("/api/send-health-query-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessOwnerEmail: center.email,
        currentUser: user,
      }),
    });

    if (emailRes.ok) {
      alert("Enquiry sent successfully!");
    } else {
      alert("Failed to send enquiry. Please try again.");
    }
  };

  if (loading)
    return <p className="p-6 text-gray-500">Loading wellness centers...</p>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 bg-yellow-50 min-h-screen">
      {/* 🔹 Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-3xl">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
            >
              <X className="h-5 w-5 text-black" />
            </button>
            <img
              src={modalImages[modalIndex]}
              alt="modal-img"
              className="w-full max-h-[80vh] object-contain rounded"
            />
          </div>
        </div>
      )}

      {/* 🔹 Login Modal */}
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
              Please login to connect with centers or send enquiries.
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

      {/* 🔹 Sidebar */}
      <div className="w-full lg:w-60">
        <Card className="p-4 shadow-md bg-[#FFF8DE] border border-[#FFF6D5] mb-6 lg:mb-0">
          <h2 className="text-lg font-bold mb-3 text-red-700">
            Popular Wellness Categories
          </h2>
          {(() => {
            const [showAll, setShowAll] = React.useState(false);
            const categories = [
              "Gym",
              "Yoga Center",
              "Spa",
              "Clinic",
              "Hospital",
              "Nutritionist",
              "Physiotherapy",
              "Meditation Center",
              "Ayurvedic Therapy",
              "Wellness Retreat",
              "Rehab Center",
              "Detox Center",
              "Weight Loss Program",
              "Massage Therapy",
            ];
            const displayed = showAll ? categories : categories.slice(0, 8);
            return (
              <>
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 text-gray-700 text-sm">
                  {displayed.map((c, i) => (
                    <li key={i} className="hover:text-orange-600 cursor-pointer">
                      {c}
                    </li>
                  ))}
                </ul>
                <p
                  onClick={() => setShowAll((prev) => !prev)}
                  className="mt-3 text-red-700 underline text-sm cursor-pointer text-center"
                >
                  {showAll ? "Show Less" : "View All"}
                </p>
              </>
            );
          })()}
        </Card>
      </div>

      {/* 🔹 Main Content */}
      <div className="flex-1">
        {/* 🔍 Search */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col sm:flex-row items-center gap-3 border">
          <div className="flex items-center w-full gap-2">
            <Search className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by category, name, city, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button
              onClick={handleSearch}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Search
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-orange-400 text-orange-500 hover:bg-orange-50"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Banner */}
        <div className="w-full h-40 sm:h-56 bg-orange-200 rounded-2xl mb-6 flex items-center justify-center">
          <h2 className="text-base sm:text-xl font-bold text-red-700">
            Featured Health & Wellness Centers
          </h2>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-red-700 mb-6">
          Health & Wellness Listings
        </h2>

        <div className="space-y-6">
          {filteredCenters.length > 0 ? (
            filteredCenters.map((center, i) => {
              const images = center.docUrls || [];
              return (
                <Card
                  key={i}
                  className="relative shadow-lg bg-white border border-yellow-200"
                >
                  <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Image */}
                    <div className="flex justify-center">
                      {images.length > 0 ? (
                        <img
                          src={images[0]}
                          alt={center.centerName}
                          className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded border cursor-pointer"
                          onClick={() => openImageModal(images, 0)}
                        />
                      ) : (
                        <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center border rounded bg-gray-100 text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-base sm:text-lg">
                          {center.centerName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Category: {center.category}
                        </p>
                        <p className="text-sm text-gray-600">
                          City: {center.city}, {center.state}
                        </p>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Offerings:</p>
                          {center.offerings?.length > 0 ? (
                            <ul className="list-disc ml-5 text-sm text-gray-700">
                              {center.offerings.map((o: string, idx: number) => (
                                <li key={idx}>{o}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No offerings added
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          onClick={() => handleEnquiry(center)}
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-sm px-4 py-2"
                        >
                          Enquire
                        </Button>
                        <Button
                          onClick={() => handleKnowMore(center)}
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-sm px-4 py-2"
                        >
                          Know More
                        </Button>
                      </div>
                    </div>

                    {/* About */}
                    <div>
                      {center.about ? (
                        <>
                          <p className="text-sm font-medium">About:</p>
                          <p className="text-sm text-gray-700 line-clamp-4">
                            {center.about}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          No description available.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-center text-gray-600">
              No wellness centers found for your search.
            </p>
          )}
        </div>
      </div>

      {/* 🔹 Details Modal */}
     {showDetailsModal && selectedCenter && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
      {/* Close Button */}
      <button
        onClick={() => setShowDetailsModal(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Title */}
      <h2 className="text-xl font-bold mb-4 text-red-700 text-center">
        {selectedCenter.centerName}
      </h2>

      {/* Logo */}
      {selectedCenter.logoUrl && (
        <img
          src={selectedCenter.logoUrl}
          alt={selectedCenter.centerName}
          className="w-40 h-40 object-cover rounded mb-4 mx-auto"
        />
      )}

      {/* Basic Info */}
      <div className="space-y-2 text-gray-700">
        <p>
          <strong>Category:</strong> {selectedCenter.category}
        </p>
        <p>
          <strong>Owner:</strong> {selectedCenter.ownerName}
        </p>
        <p>
          <strong>Email:</strong> {selectedCenter.email}
        </p>
        <p>
          <strong>Phone:</strong> {selectedCenter.phone}
        </p>
        <p>
          <strong>Address:</strong> {selectedCenter.address},{" "}
          {selectedCenter.city}, {selectedCenter.state} -{" "}
          {selectedCenter.pincode}
        </p>
        <p>
          <strong>About:</strong>{" "}
          {selectedCenter.about || (
            <span className="italic text-gray-500">No description available.</span>
          )}
        </p>
      </div>

      {/* Offerings */}
      {selectedCenter.offerings?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-red-700">Services Offered:</h3>
          <ul className="list-disc ml-6 text-gray-700">
            {selectedCenter.offerings.map((service: string, i: number) => (
              <li key={i}>{service}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔹 Documents Section */}
      {selectedCenter.docUrls?.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2 text-red-700">Uploaded Documents:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {selectedCenter.docUrls.map((url: string, i: number) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border rounded-lg overflow-hidden hover:shadow-md transition"
              >
                {url.endsWith(".pdf") ? (
                  <div className="flex flex-col items-center justify-center p-4 bg-gray-50">
                    <img
                      src="/pdf-icon.png"
                      alt="PDF"
                      className="w-10 h-10 mb-2"
                    />
                    <p className="text-xs text-gray-600">View PDF</p>
                  </div>
                ) : (
                  <img
                    src={url}
                    alt={`Document ${i + 1}`}
                    className="w-full h-32 object-cover"
                  />
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
}
