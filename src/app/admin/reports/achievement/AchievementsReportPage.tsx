"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Loader from "@/src/components/ui/loader";
import Pagination from "@/src/components/common/Pagination";

interface Achievement {
  id: number;
  name: string;
  title: string;
  description: string;
  image: string;
  category: string;
  isVerified: boolean;
  isFeatured: boolean;
  isHallOfFame: boolean;
  year: number;
  location: string;
  keyAchievement: string;
  impact: string;
  achievements: string[];
  status: string;
  createdBy: string;
  createdById: string;
  removedBy?: string;
  removedById?: string;
  removedAt?: string;
  createdAt: string;
  updatedAt: string;
  reason?: string;
  updatedBy?: string;
  updatedById?: string;
}

export default function AchievementsReportPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [allFilteredAchievements, setAllFilteredAchievements] = useState<
    Achievement[]
  >([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / pageSize);

  // ✅ Fetch achievements
  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", "1");
        params.append("limit", "1000");
        if (statusFilter) params.append("status", statusFilter);
        if (categoryFilter) params.append("category", categoryFilter);

        const res = await fetch(
          `/api/reports/achievements?${params.toString()}`
        );
        const data = await res.json();

        let records: Achievement[] = data.achievements || [];

        // ✅ Apply search filter client-side
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          records = records.filter(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.title.toLowerCase().includes(q) ||
              a.category.toLowerCase().includes(q) ||
              a.location.toLowerCase().includes(q)
          );
        }

        setAllFilteredAchievements(records);
        setTotalCount(records.length);
        setAchievements(
          records.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        );
      } catch (err) {
        console.error("Error fetching achievements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [statusFilter, categoryFilter, searchQuery, currentPage, pageSize]);

  // ✅ Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  // ✅ Export Excel
  const exportToExcel = () => {
    if (allFilteredAchievements.length === 0) return;

    const sortedData = [...allFilteredAchievements].sort((a, b) =>
      a.name.localeCompare(b.name, "en", { sensitivity: "base" })
    );

    const dataToExport = sortedData.map((a) => ({
      Name: a.name,
      Title: a.title,
      Category: a.category,
      Year: a.year,
      Location: a.location,
      "Key Achievement": a.keyAchievement,
      Impact: a.impact,
      Verified: a.isVerified ? "Yes" : "No",
      Featured: a.isFeatured ? "Yes" : "No",
      "Hall of Fame": a.isHallOfFame ? "Yes" : "No",
      Status: a.status,
      "Created By": a.createdBy,
      "Created On": formatDate(a.createdAt),
      "Updated On": formatDate(a.updatedAt),
      "Removed By": a.removedBy || "-",
      "Removed On": formatDate(a.removedAt),
      Reason: a.reason || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Achievements");
    XLSX.writeFile(workbook, "achievements-report.xlsx");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Achievements Report</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded shadow">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          {/* <option value="removed">Removed</option> */}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Sports">Sports</option>
          <option value="Technology">Technology</option>
          <option value="Education">Education</option>
          <option value="Business">Business</option>
          <option value="Arts">Arts</option>
        </select>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by name, title, or location"
          className="border p-2 rounded w-64"
        />

        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export Excel
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto bg-white p-4 rounded shadow">
            <table className="min-w-full border border-gray-200 rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Sl.No</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Category</th>
                  <th className="px-4 py-2 border">Year</th>
                  <th className="px-4 py-2 border">Location</th>
                  <th className="px-4 py-2 border">Status</th>
                  {/* <th className="px-4 py-2 border">Verified</th> */}
                  <th className="px-4 py-2 border">Featured</th>
                  <th className="px-4 py-2 border">Created By</th>
                  <th className="px-4 py-2 border">Created On</th>
                  <th className="px-4 py-2 border">Updated On</th>
                  <th className="px-4 py-2 border">Updated By</th>
                  <th className="px-4 py-2 border">Removed By</th>
                  <th className="px-4 py-2 border">Reason</th>
                </tr>
              </thead>
              <tbody>
                {achievements.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center p-4">
                      No achievements found
                    </td>
                  </tr>
                ) : (
                  achievements.map((a, index) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-2 border">{a.name}</td>
                      <td className="px-4 py-2 border">{a.title}</td>
                      <td className="px-4 py-2 border">{a.category}</td>
                      <td className="px-4 py-2 border">{a.year}</td>
                      <td className="px-4 py-2 border">{a.location}</td>
                      <td className="px-4 py-2 border capitalize">
                        {a.status}
                      </td>
                      {/* <td className="px-4 py-2 border">{a.isVerified ? "Yes" : "No"}</td> */}
                      <td className="px-4 py-2 border">
                        {a.isFeatured ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-2 border">{a.createdBy}</td>
                      <td className="px-4 py-2 border">
                        {formatDate(a.createdAt)}
                      </td>
                      <td className="px-4 py-2 border">
                        {a.updatedBy ? formatDate(a.updatedAt) : "-"}
                      </td>
                      <td className="px-4 py-2 border">{a.updatedBy || "-"}</td>
                      <td className="px-4 py-2 border">{a.removedBy || "-"}</td>
                      <td className="px-4 py-2 border">{a.reason || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </>
      )}
    </div>
  );
}
