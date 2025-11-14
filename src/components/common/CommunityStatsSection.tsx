"use client";

import { useEffect, useState } from "react";

interface CommunityStats {
  successfulMarriages: number;
  registeredFamilies: number;
  countriesConnected: number;
  forumDiscussions: number;
  matrimonialProfiles: number;
  registeredBusinessHouses: number;
}

export function CommunityStatsSection() {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/masters");
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-[#FFFDEF] px-4 sm:px-6 lg:px-8 py-10">
      <div className="container mx-auto">
        <div className="bg-[linear-gradient(125deg,#ffae00,#8B0000,#FF5C00)] text-white py-10 rounded-2xl shadow-xl">
          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-3">
              Our Growing Community
            </h2>
            <p className="text-sm sm:text-base text-white/80">
              Connecting families and creating lifelong bonds
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-12">
            {/* Registered Families */}
            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold mb-2">
                {loading
                  ? "..."
                  : `${stats?.registeredFamilies?.toLocaleString() || 0}+`}
              </div>
              <div className="text-sm sm:text-base text-white/80">
                Registered Members
              </div>
            </div>

            {/* Successful Marriages */}
            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold mb-2">
                {loading
                  ? "..."
                  : `${stats?.matrimonialProfiles?.toLocaleString() || 0}+`}
              </div>
              <div className="text-sm sm:text-base text-white/80">
               Matrimonial Profiles
              </div>
            </div>

            {/* Countries Connected */}
            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold mb-2">
                {loading
                  ? "..."
                  : `${stats?.registeredBusinessHouses?.toLocaleString() || 0}+`}
              </div>
              <div className="text-sm sm:text-base text-white/80">
                Registered Business Houses
              </div>
            </div>

            {/* Forum Discussions */}
            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold mb-2">
                {loading
                  ? "..."
                  : `${stats?.forumDiscussions?.toLocaleString() || 0}+`}
              </div>
              <div className="text-sm sm:text-base text-white/80">
                Help Discussions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
