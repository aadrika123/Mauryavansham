"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Branch {
  name: string;
  address: string;
  phone: string;
}

interface CoachingCenter {
  id: number;
  centerName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  courses: string[];
  branches: Branch[];
  logoUrl?: string;
  docUrls?: string[];
  status: string;
  createdAt?: string;
  updatedAt?: string;
  about?: string;
}

const MyRegisteredCoaching = () => {
  const { data: session } = useSession();
  const [coachingList, setCoachingList] = useState<CoachingCenter[]>([]);
  const [selectedCoaching, setSelectedCoaching] =
    useState<CoachingCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [editCoaching, setEditCoaching] = useState<CoachingCenter | null>(null);
  const router = useRouter();

  const fetchCoachingCenters = async () => {
    try {
      if (!session?.user?.id) return;
      const res = await fetch(
        `/api/coaching-centers?userId=${session.user.id}`
      );
      const data = await res.json();
      if (data.success) {
        setCoachingList(data.data);
      }
    } catch (err) {
      console.error("Error fetching coaching centers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoachingCenters();
  }, [session]);

  if (loading)
    return (
      <p className="p-6 text-gray-500">Loading your registered centers...</p>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        My Registered Coaching Centers
      </h1>

      {coachingList.length === 0 ? (
        <p className="text-gray-500">No coaching centers registered yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coachingList.map((center) => (
            <div
              key={center.id}
              className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition relative"
            >
              {/* Logo */}
              {center.logoUrl && (
                <img
                  src={center.logoUrl}
                  alt="logo"
                  className="w-20 h-20 object-cover rounded-md mb-3"
                />
              )}

              {/* Basic Info */}
              <h2 className="text-lg font-bold mb-1">{center.centerName}</h2>
              <p className="text-sm text-gray-600">Owner: {center.ownerName}</p>
              <p className="text-sm text-gray-600">City: {center.city}</p>

              {/* Status Badge */}
              <span
                className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${
                  center.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : center.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {center.status.toUpperCase()}
              </span>

              {/* View Button */}
              <button
                onClick={() => setSelectedCoaching(center)}
                className="mt-3 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 w-full"
              >
                View Full Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedCoaching && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            {/* <button
              onClick={() => {
                router.push(`/admin/register-coaching/edit/${selectedCoaching.id}`);
              }}
              className="mt-3 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600 w-full"
            >
              Edit Details
            </button> */}

            <button
              onClick={() => setSelectedCoaching(null)}
              className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
            >
              ×
            </button>

            {/* Logo */}
            {selectedCoaching.logoUrl && (
              <img
                src={selectedCoaching.logoUrl}
                alt="logo"
                className="w-24 h-24 object-cover rounded-md mb-4 mx-auto"
              />
            )}

            <h2 className="text-2xl font-bold mb-3 text-center">
              {selectedCoaching.centerName}
            </h2>

            {/* Basic Info */}
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Owner:</strong> {selectedCoaching.ownerName}
              </p>
              <p>
                <strong>Email:</strong> {selectedCoaching.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedCoaching.phone}
              </p>
              <p>
                <strong>Address:</strong> {selectedCoaching.address},{" "}
                {selectedCoaching.city}, {selectedCoaching.state} -{" "}
                {selectedCoaching.pincode}
              </p>
              <p>
                <strong>Status:</strong> {selectedCoaching.status}
              </p>
              <p>
                <strong>Registered On:</strong>{" "}
                {new Date(
                  selectedCoaching.createdAt || ""
                ).toLocaleDateString()}
              </p>
              <p>
                <strong>About:</strong> {selectedCoaching.about || "N/A"}
              </p>
            </div>

            {/* Courses */}
            {selectedCoaching.courses?.length > 0 ? (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Courses Offered:</h3>
                <ul className="list-disc ml-6 text-gray-600">
                  {selectedCoaching.courses.map((course, i) => (
                    <li key={i}>{course}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">
                No courses added yet.
              </p>
            )}

            {/* Branches */}
            {selectedCoaching.branches?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Branches:</h3>
                {selectedCoaching.branches.map((b, i) => (
                  <div key={i} className="text-gray-600 mb-1 border-b pb-1">
                    <p>
                      <strong>{b.name}</strong>
                    </p>
                    <p>{b.address}</p>
                    <p className="text-sm text-gray-500">📞 {b.phone}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Uploaded Documents */}
            {selectedCoaching.docUrls &&
              selectedCoaching.docUrls.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Uploaded Documents:</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedCoaching.docUrls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border rounded-lg overflow-hidden hover:shadow-md"
                      >
                        {url.endsWith(".pdf") ? (
                          <div className="flex flex-col items-center justify-center p-6">
                            <img
                              src="/pdf-icon.png"
                              alt="PDF"
                              className="w-12 h-12 mb-2"
                            />
                            <p className="text-sm text-gray-600">View PDF</p>
                          </div>
                        ) : (
                          <img
                            src={url}
                            alt={`Document ${i + 1}`}
                            className="w-full h-40 object-cover"
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
};

export default MyRegisteredCoaching;
