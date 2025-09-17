"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Loader from "@/src/components/ui/loader";
import { useParams, useRouter } from "next/navigation";

type Interest = {
  id: number;
  senderId: string;
  receiverId?: string;
  senderProfile?: Record<string, any>;
  createdAt?: string;
  senderProfileId?: string;
};

export default function ProfileInterestsPage( { user }: { user: string } ) {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const profileId = params?.profileId; 
  const router = useRouter();

  useEffect(() => {
    if (!profileId) return;

    const fetchInterests = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/profile-interest/${profileId}/interests`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch interests");

        const data = await res.json();
        setInterests(data.interests || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch interests");
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, [profileId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />{" "}
      </div>
    );

  if (error)
    return (
      <p className="text-center py-8 text-red-500">
        {error}. Check your API path and server logs.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Interested Profiles
      </h1> */}

      {interests.length === 0 ? (
        <p className="text-gray-600 text-center py-10">
          Nobody has expressed interest yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {interests.map((interest) => {
            const sender = interest.senderProfile || {};
            const displayName = sender.name || interest.senderId || "Unknown";
            const displayLocation = sender.city || sender.state || "NA";
            const interestId =  interest.senderProfileId || "";

            return (
              <Card
                key={interest.id}
                className="rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">
                    {String(displayName).charAt(0).toUpperCase()}
                  </div>

                  <h2 className="text-lg font-semibold text-gray-800">
                    {displayName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {displayLocation}
                  </p>

                  <div className="w-full mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      className="w-1/2"
                      onClick={() => {
                      if (user == "user") {
                        router.push(`/dashboard/search-profile/${interestId}`);
                      } else {
                        router.push(`/dashboard/search-profile/${interestId}`);
                      }
                    }}
                    >
                      View Profile
                    </Button>
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    {interest.createdAt
                      ? new Date(interest.createdAt).toLocaleString()
                      : ""}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
