"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Loader from "@/src/components/ui/loader";
import Pagination from "@/src/components/common/Pagination";

interface Business {
  id: number;
  userId: number;
  organizationName: string;
  organizationType: string;
  businessCategory: string;
  businessDescription: string;
  partners: { name: string; role: string }[];
  //   categories: string[
  //     { main: string; sub: string }
  //   ];
  categories: { main: string; sub: string }[];
  dateOfestablishment: string | null;
  companyWebsite?: string;
  officialEmail?: string;
  officialContactNumber?: string;
  registeredAddress: any;
  branchOffices: any[];
  cin?: string;
  gst?: string;
  udyam?: string;
  photos: { product: string[]; office: string[] };
  premiumCategory: string;
  paymentStatus: boolean;
  isActive: boolean;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
}

export default function BusinessReportsPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [allFilteredBusinesses, setAllFilteredBusinesses] = useState<
    Business[]
  >([]);
  const [statusFilter, setStatusFilter] = useState(""); // active/inactive
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (statusFilter) queryParams.append("status", statusFilter);
        if (fromDate) queryParams.append("from", fromDate);
        if (toDate) queryParams.append("to", toDate);

        const res = await fetch(
          `/api/register-business?${queryParams.toString()}`
        );
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map((item: any) => ({
            ...item.businesses,
            user: item.users,
          }));

          setAllFilteredBusinesses(mapped);
          setTotalCount(mapped.length);
          setBusinesses(
            mapped.slice((currentPage - 1) * pageSize, currentPage * pageSize)
          );
        } else {
          setAllFilteredBusinesses([]);
          setBusinesses([]);
          setTotalCount(0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [currentPage, pageSize, statusFilter, fromDate, toDate]); // include date filters

  // Format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Export to Excel
  const exportToExcel = () => {
    if (allFilteredBusinesses.length === 0) return;

    const sortedBusinesses = [...allFilteredBusinesses].sort((a, b) =>
      a.organizationName.localeCompare(b.organizationName, "en", {
        sensitivity: "base",
      })
    );

    const dataToExport = sortedBusinesses.map((b) => ({
      "Organization Name": b.organizationName,
      "Organization Type": b.organizationType,
      "Business Category": b.businessCategory,
      Description: b.businessDescription,
      Partners: b.partners?.map((p) => p.name).join(", ") || "-",
      //   Categories: b.categories?.join(", ") || "-",
      Categories:
        b.categories?.map((c) => `${c.main} , ${c.sub}`).join(", ") || "-",
      "Date of Establishment": formatDate(b.dateOfestablishment || null),
      Website: b.companyWebsite || "-",
      "Official Email": b.officialEmail || "-",
      "Official Contact": b.officialContactNumber || "-",
      "Premium Category": b.premiumCategory || "-",
      "Payment Status": b.paymentStatus ? "Paid" : "Pending",
      Status: b.isActive ? "Active" : "Inactive",
      "Created By": b.user.name,
      "Created On": formatDate(b.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Businesses");
    XLSX.writeFile(workbook, "businesses-report.xlsx");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Business Reports</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded shadow ">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        {/* From Date */}
        <div>
          <label className="block text-xs mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-xs mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>
        <button
          onClick={() => {
            setStatusFilter("");
            setFromDate("");
            setToDate("");
            setCurrentPage(1);
          }}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Clear Filters
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
          <div className="overflow-x-auto border rounded shadow ">
            <table className="min-w-full border border-gray-200 rounded text-xs">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 border">Sl.No</th>
                  <th className="px-4 py-2 border">Organization Name</th>
                  <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Category</th>
                  <th className="px-4 py-2 border ">Description</th>
                  <th className="px-4 py-2 border">Partners</th>
                  <th className="px-4 py-2 border">Categories</th>
                  <th className="px-4 py-2 border ">Date of Establishment</th>
                  <th className="px-4 py-2 border ">Website</th>
                  <th className="px-4 py-2 border ">Official Email</th>
                  <th className="px-4 py-2 border ">Official Contact</th>
                  <th className="px-4 py-2 border">Premium Category</th>
                  <th className="px-4 py-2 border">Payment Status</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Created By</th>
                  <th className="px-4 py-2 border ">Created On</th>
                </tr>
              </thead>
              <tbody>
                {businesses.length === 0 ? (
                  <tr>
                    <td colSpan={16} className="text-center p-4">
                      No businesses found
                    </td>
                  </tr>
                ) : (
                  businesses.map((b, index) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-2 border">{b.organizationName}</td>
                      <td className="px-4 py-2 border">{b.organizationType}</td>
                      <td className="px-4 py-2 border">{b.businessCategory}</td>
                      <td className="px-4 py-2 border ">
                        {b.businessDescription}
                      </td>
                      <td className="px-4 py-2 border">
                        {b.partners?.map((p) => p.name).join(", ") || "-"}
                      </td>
                      <td className="px-4 py-2 border">
                        {b.categories
                          ?.map((c) => `${c.main} , ${c.sub}`)
                          .join(", ") || "-"}
                      </td>
                      <td className="px-4 py-2 border ">
                        {formatDate(b.dateOfestablishment || null)}
                      </td>
                      <td className="px-4 py-2 border ">
                        {b.companyWebsite || "-"}
                      </td>
                      <td className="px-4 py-2 border ">
                        {b.officialEmail || "-"}
                      </td>
                      <td className="px-4 py-2 border ">
                        {b.officialContactNumber || "-"}
                      </td>
                      <td className="px-4 py-2 border">{b.premiumCategory}</td>
                      <td className="px-4 py-2 border">
                        {b.paymentStatus ? "Paid" : "Pending"}
                      </td>
                      <td className="px-4 py-2 border">
                        {b.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="px-4 py-2 border">{b.user.name}</td>
                      <td className="px-4 py-2 border ">
                        {formatDate(b.createdAt)}
                      </td>
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
