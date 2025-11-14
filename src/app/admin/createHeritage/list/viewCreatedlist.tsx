"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface HeritageItem {
  id: number;
  title: string;
  badge: string | null;
  imageUrl: string | null;
  order: number | null;
  isActive: boolean;
  createdByName?: string | null;
  createdAt?: string | null;
}

export default function HeritageListPage() {
  const router = useRouter();
  const [heritageList, setHeritageList] = useState<HeritageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/heritage/list")
      .then((res) => res.json())
      .then((data) => {
        setHeritageList(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading heritage data...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-red-700">Heritage List</h2>
        <button
          onClick={() => router.push("/admin/createHeritage/formPage")}
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Heritage
        </button>
      </div>

      {heritageList.length === 0 ? (
        <p className="text-gray-600">No heritage items found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full border-collapse bg-white">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border-b">#</th>
                <th className="p-3 border-b">Image</th>
                <th className="p-3 border-b">Title</th>
                <th className="p-3 border-b">Badge</th>
                <th className="p-3 border-b">Order</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Created By</th>
                <th className="p-3 border-b text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {heritageList.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{index + 1}</td>
                  <td className="p-3 border-b">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </td>
                  <td className="p-3 border-b font-medium">{item.title}</td>
                  <td className="p-3 border-b">{item.badge || "-"}</td>
                  <td className="p-3 border-b">{item.order ?? "-"}</td>
                  <td className="p-3 border-b">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 border-b text-sm text-gray-600">
                    {item.createdByName || "—"}
                  </td>
                  <td className="p-3 border-b text-right">
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/createHeritage/formPage?id=${item.id}`
                        )
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
