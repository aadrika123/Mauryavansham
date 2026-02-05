'use client';

import { useState, useEffect } from 'react';
import { exportToExcel } from '@/src/utils/exportExcel';
import Loader from '@/src/components/ui/loader';
import Pagination from '@/src/components/common/Pagination';

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
  branches: {
    name: string;
    phone: string;
    address: string;
  }[];
  logoUrl?: string;
  docUrls?: string[];
  status: string;
  approvedBy?: string | null;
  rejectedBy?: string | null;
  about?: string | null;
  rejectedReason?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export default function EducationReportsPage() {
  const [centers, setCenters] = useState<CoachingCenter[]>([]);
  const [allFilteredCenters, setAllFilteredCenters] = useState<
    CoachingCenter[]
  >([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / pageSize);

  // ✅ Fetch Coaching Centers
  useEffect(() => {
    const fetchCenters = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', pageSize.toString());
        if (statusFilter) params.append('status', statusFilter);
        if (cityFilter) params.append('city', cityFilter);
        if (stateFilter) params.append('state', stateFilter);
        if (searchQuery) params.append('search', searchQuery);

        const res = await fetch(`/api/reports/educations?${params.toString()}`);
        const result = await res.json();

        const centersData = result.data || [];
        setAllFilteredCenters(centersData);
        setTotalCount(result.totalCount);
        setCenters(centersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, [
    statusFilter,
    cityFilter,
    stateFilter,
    searchQuery,
    currentPage,
    pageSize
  ]);

  // ✅ Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // ✅ Export to Excel
  const handleExportToExcel = async () => {
    if (allFilteredCenters.length === 0) return;

    const sortedCenters = [...allFilteredCenters].sort((a, b) =>
      a.centerName.localeCompare(b.centerName, 'en', { sensitivity: 'base' })
    );

    const dataToExport = sortedCenters.map((c) => ({
      'Center Name': c.centerName,
      'Owner Name': c.ownerName,
      Email: c.email,
      Phone: c.phone,
      Address: c.address,
      City: c.city,
      State: c.state,
      Pincode: c.pincode,
      'Courses Offered': c.courses?.join(', ') || '-',
      Branches:
        c.branches
          ?.map((b) => `${b.name} (${b.phone || '-'}, ${b.address || '-'})`)
          .join('; ') || '-',
      Logo: c.logoUrl || '-',
      Documents: c.docUrls?.join(', ') || '-',
      Status: c.status,
      'Created On': formatDate(c.createdAt),
      'Updated On': formatDate(c.updatedAt)
    }));

    await exportToExcel(dataToExport, 'Coaching Centers', 'education-report');
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Education Reports</h1>

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
            'Andhra Pradesh',
            'Arunachal Pradesh',
            'Assam',
            'Bihar',
            'Chhattisgarh',
            'Goa',
            'Gujarat',
            'Haryana',
            'Himachal Pradesh',
            'Jharkhand',
            'Karnataka',
            'Kerala',
            'Madhya Pradesh',
            'Maharashtra',
            'Manipur',
            'Meghalaya',
            'Mizoram',
            'Nagaland',
            'Odisha',
            'Punjab',
            'Rajasthan',
            'Sikkim',
            'Tamil Nadu',
            'Telangana',
            'Tripura',
            'Uttar Pradesh',
            'Uttarakhand',
            'West Bengal'
          ].map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <button
          onClick={handleExportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded"
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
            <table className="min-w-full border border-gray-200 rounded text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Sl.No</th>
                  <th className="px-4 py-2 border">Logo</th>
                  <th className="px-4 py-2 border">Center Name</th>
                  <th className="px-4 py-2 border">Owner Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">City</th>
                  <th className="px-4 py-2 border">State</th>
                  <th className="px-4 py-2 border">Courses</th>
                  <th className="px-4 py-2 border">Branches</th>
                  <th className="px-4 py-2 border">Documents</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Created On</th>
                </tr>
              </thead>

              <tbody>
                {centers.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center p-4">
                      No centers found
                    </td>
                  </tr>
                ) : (
                  centers.map((c, index) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-center">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>

                      {/* ✅ Logo */}
                      <td className="px-4 py-2 border text-center">
                        {c.logoUrl ? (
                          <img
                            src={c.logoUrl}
                            alt="logo"
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          '-'
                        )}
                      </td>

                      <td className="px-4 py-2 border">{c.centerName}</td>
                      <td className="px-4 py-2 border">{c.ownerName}</td>
                      <td className="px-4 py-2 border">{c.email}</td>
                      <td className="px-4 py-2 border">{c.phone}</td>
                      <td className="px-4 py-2 border">{c.city}</td>
                      <td className="px-4 py-2 border">{c.state}</td>

                      {/* ✅ Courses */}
                      <td className="px-4 py-2 border">
                        {c.courses?.length > 0 ? c.courses.join(', ') : '-'}
                      </td>

                      {/* ✅ Branches */}
                      <td className="px-4 py-2 border">
                        {c.branches?.length > 0 ? (
                          <ul className="space-y-1">
                            {c.branches.map((b, i) => (
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
                          '-'
                        )}
                      </td>

                      {/* ✅ Documents */}
                      <td className="px-4 py-2 border">
                        {c.docUrls?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {c.docUrls.map((url, i) => (
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
                          '-'
                        )}
                      </td>

                      <td className="px-4 py-2 border capitalize">
                        {c.status}
                      </td>
                      <td className="px-4 py-2 border">
                        {formatDate(c.createdAt)}
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
