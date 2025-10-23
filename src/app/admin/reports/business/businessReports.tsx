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
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const totalPages = Math.ceil(totalCount / pageSize);

  // ✅ Basic columns (always visible)
  const basicColumns = [
    { key: "organizationName", label: "Organization Name" },
    { key: "organizationType", label: "Organization Type" },
    { key: "businessCategory", label: "Business Category" },
    { key: "isActive", label: "Status" },
    { key: "createdBy", label: "Created By" },
    { key: "createdAt", label: "Created On" },
  ];

  // ✅ Optional columns (alphabetically ordered)
  const optionalColumns = [
    // { key: "businessDescription", label: "Description" },
    { key: "categories", label: "Categories" },
    { key: "companyWebsite", label: "Website" },
    { key: "dateOfestablishment", label: "Date of Establishment" },
    { key: "officialEmail", label: "Official Email" },
    { key: "officialContactNumber", label: "Official Contact" },
    { key: "partners", label: "Partners" },
    { key: "paymentStatus", label: "Payment Status" },
    { key: "premiumCategory", label: "Premium Category" },
  ].sort((a, b) => a.label.localeCompare(b.label));

  // ✅ Fetch businesses
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
  }, [currentPage, pageSize, statusFilter, fromDate, toDate]);

  // ✅ Format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  // ✅ Excel export (no change)
  const exportToExcel = () => {
    if (allFilteredBusinesses.length === 0) return;

    const sorted = [...allFilteredBusinesses].sort((a, b) =>
      a.organizationName.localeCompare(b.organizationName, "en", {
        sensitivity: "base",
      })
    );

    const dataToExport = sorted.map((b) => ({
      "Organization Name": b.organizationName,
      "Organization Type": b.organizationType,
      "Business Category": b.businessCategory,
      Description: b.businessDescription,
      Partners: b.partners?.map((p) => p.name).join(", ") || "-",
      Categories:
        b.categories?.map((c) => `${c.main}, ${c.sub}`).join(", ") || "-",
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

  // ✅ Column selection handlers
  const handleCheckboxChange = (key: string) => {
    if (selectedColumns.includes(key)) {
      setSelectedColumns(selectedColumns.filter((c) => c !== key));
    } else {
      setSelectedColumns([...selectedColumns, key]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedColumns([]);
      setSelectAll(false);
    } else {
      setSelectedColumns(optionalColumns.map((col) => col.key));
      setSelectAll(true);
    }
  };

  const visibleColumns = [
    ...basicColumns,
    ...optionalColumns.filter((c) => selectedColumns.includes(c.key)),
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Business Reports</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded shadow">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

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

      {/* Column Selector */}
      <div className="border p-3 rounded-md bg-gray-50 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="cursor-pointer"
          />
          <span className="font-medium text-sm">Select All Columns</span>
        </div>

        <div className="max-h-56 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
            {optionalColumns.map((col) => (
              <label
                key={col.key}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col.key)}
                  onChange={() => handleCheckboxChange(col.key)}
                  className="cursor-pointer"
                />
                {col.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto border rounded shadow">
            <table className="min-w-full border border-gray-200 rounded text-xs">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  {visibleColumns.map((col) => (
                    <th key={col.key} className="px-4 py-2 border">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {businesses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleColumns.length + 1}
                      className="text-center p-4"
                    >
                      No businesses found
                    </td>
                  </tr>
                ) : (
                  businesses.map((b, index) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      {visibleColumns.map((col) => {
                        let value = "-";
                        switch (col.key) {
                          case "createdBy":
                            value = b.user.name;
                            break;
                          case "createdAt":
                            value = formatDate(b.createdAt);
                            break;
                          case "isActive":
                            value = b.isActive ? "Active" : "Inactive";
                            break;
                          case "dateOfestablishment":
                            value = formatDate(b.dateOfestablishment || null);
                            break;
                          case "partners":
                            value =
                              b.partners?.map((p) => p.name).join(", ") || "-";
                            break;
                          case "categories":
                            value =
                              b.categories
                                ?.map((c) => `${c.main}, ${c.sub}`)
                                .join(", ") || "-";
                            break;
                          case "paymentStatus":
                            value = b.paymentStatus ? "Paid" : "Pending";
                            break;
                          default:
                            // @ts-ignore
                            value = b[col.key] || "-";
                        }

                        return (
                          <td key={col.key} className="px-4 py-2 border">
                            {value}
                          </td>
                        );
                      })}
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
