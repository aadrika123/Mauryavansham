"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Loader from "@/src/components/ui/loader";
import Pagination from "@/src/components/common/Pagination";

interface HealthService {
  id: number;
  userId: string;
  centerName: string;
  category: string;
  ownerName: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  offerings: string[];
  branches: {
    name: string;
    address: string;
    phone: string;
  }[];
  about?: string;
  logoUrl?: string;
  docUrls?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function HealthReportsPage() {
  const [services, setServices] = useState<HealthService[]>([]);
  const [allFilteredServices, setAllFilteredServices] = useState<HealthService[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append("page", currentPage.toString());
        params.append("limit", pageSize.toString());
        if (statusFilter) params.append("status", statusFilter);
        if (cityFilter) params.append("city", cityFilter);
        if (stateFilter) params.append("state", stateFilter);
        if (searchQuery) params.append("search", searchQuery);

        const res = await fetch(`/api/reports/health?${params.toString()}`);
        const result = await res.json();

        const data = result.data || [];
        setAllFilteredServices(data);
        setTotalCount(result.totalCount);
        setServices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [statusFilter, cityFilter, stateFilter, searchQuery, currentPage, pageSize]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getFullYear()}`;
  };

  const exportToExcel = () => {
    if (allFilteredServices.length === 0) return;

    const dataToExport = allFilteredServices.map((s) => ({
      "Center Name": s.centerName,
      Category: s.category,
      "Owner Name": s.ownerName,
      Email: s.email || "-",
      Phone: s.phone,
      Address: s.address || "-",
      City: s.city || "-",
      State: s.state || "-",
      Pincode: s.pincode || "-",
      Offerings: s.offerings?.join(", ") || "-",
      Branches:
        s.branches?.map((b) => `${b.name} (${b.phone || "-"}, ${b.address || "-"})`).join("; ") ||
        "-",
      Logo: s.logoUrl || "-",
      Documents: s.docUrls?.join(", ") || "-",
      Status: s.status,
      "Created On": formatDate(s.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Health Services");
    XLSX.writeFile(workbook, "health-services-report.xlsx");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Health & Wellness Reports</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Search by name, owner, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="inactive">Inactive</option>
        </select>

        <input
          type="text"
          placeholder="City"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border p-2 rounded w-40"
        />

        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="border p-2 rounded w-48"
        >
          <option value="">All States</option>
          {[
            "Bihar",
            "Uttar Pradesh",
            "Delhi",
            "Maharashtra",
            "West Bengal",
            "Madhya Pradesh",
            "Rajasthan",
            "Karnataka",
            "Tamil Nadu",
            "Kerala",
            "Punjab",
            "Haryana",
            "Gujarat",
            "Jharkhand",
            "Odisha",
            "Assam",
          ].map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white p-4 rounded shadow">
            <table className="min-w-full border border-gray-200 rounded text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Sl.No</th>
                  <th className="px-4 py-2 border">Logo</th>
                  <th className="px-4 py-2 border">Center Name</th>
                  <th className="px-4 py-2 border">Category</th>
                  <th className="px-4 py-2 border">Owner Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">City</th>
                  <th className="px-4 py-2 border">State</th>
                  <th className="px-4 py-2 border">Offerings</th>
                  <th className="px-4 py-2 border">Branches</th>
                  <th className="px-4 py-2 border">Documents</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Created On</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center p-4">
                      No records found
                    </td>
                  </tr>
                ) : (
                  services.map((s, index) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-center">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {s.logoUrl ? (
                          <img
                            src={s.logoUrl}
                            alt="logo"
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-2 border">{s.centerName}</td>
                      <td className="px-4 py-2 border">{s.category}</td>
                      <td className="px-4 py-2 border">{s.ownerName}</td>
                      <td className="px-4 py-2 border">{s.email || "-"}</td>
                      <td className="px-4 py-2 border">{s.phone}</td>
                      <td className="px-4 py-2 border">{s.city || "-"}</td>
                      <td className="px-4 py-2 border">{s.state || "-"}</td>
                      <td className="px-4 py-2 border">
                        {s.offerings?.join(", ") || "-"}
                      </td>
                      <td className="px-4 py-2 border">
                        {s.branches?.length > 0 ? (
                          <ul className="space-y-1">
                            {s.branches.map((b, i) => (
                              <li key={i}>
                                <span className="font-medium">{b.name}</span>
                                <div className="text-xs text-gray-500">
                                  {b.phone && <span>📞 {b.phone}</span>}
                                  {b.address && <span> • {b.address}</span>}
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-2 border">
                        {s.docUrls?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {s.docUrls.map((url, i) => (
                              <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline text-xs"
                              >
                                View Doc {i + 1}
                              </a>
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-2 border capitalize">{s.status}</td>
                      <td className="px-4 py-2 border">{formatDate(s.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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
