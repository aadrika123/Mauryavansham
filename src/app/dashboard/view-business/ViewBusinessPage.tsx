"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import Loader from "@/src/components/ui/loader";

export default function MyBusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = async () => {
    setLoading(true);
    const res = await fetch("/api/businesses/my-businesses");
    const data = await res.json();
    if (data.success) setBusinesses(data.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this business?")) return;

    const res = await fetch(`/api/businesses/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      alert("Business deleted");
      fetchBusinesses();
    } else {
      alert(data.message || "Error deleting business");
    }
  };

  //   if (loading) return <p className="p-6"><Loader /></p>;

  return (
    <div className="p-6">
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
          <Loader />
        </div>
      )}{" "}
      <h1 className="text-2xl font-bold mb-4">My Registered Businesses</h1>
      {businesses.length === 0 ? (
        <p>No businesses registered yet.</p>
      ) : (
        <div className="space-y-4">
          {businesses.map((biz) => (
            <div
              key={biz.id}
              className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg">
                  {biz.organizationName}
                </h2>
                <p className="text-gray-600 text-sm">{biz.organizationType}</p>
                <p className="text-gray-500 text-sm">{biz.businessCategory}</p>
              </div>

              <div className="flex gap-2">
                {/* View */}
                <Link
                  href={`/dashboard/view-business/${biz.id}`}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  View
                </Link>
                <Link
                  href={`/dashboard/view-business/${biz.id}/edit`}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
