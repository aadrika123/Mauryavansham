'use client';

import { useState, useEffect } from 'react';
import { exportToExcel } from '@/src/utils/exportExcel';
import Loader from '@/src/components/ui/loader';
import Pagination from '@/src/components/common/Pagination';

interface Ad {
  id: number;
  title: string;
  bannerImageUrl: string;
  fromDate: string;
  toDate: string;
  status: string;
  createdAt: string;
  approvedAt?: string;
  user?: {
    name: string;
    email: string;
  };
  viewCount: number;
  daysLeft?: number;
  isActive?: boolean;
  isExpired?: boolean;
}

export default function AdsReportPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [allFilteredAds, setAllFilteredAds] = useState<Ad[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '1000');
        if (statusFilter) params.append('status', statusFilter);

        const res = await fetch(`/api/ads?${params.toString()}`);
        const data = await res.json();

        const adsData = data.ads || [];
        setAllFilteredAds(adsData);
        setTotalCount(adsData.length);
        setAds(
          adsData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [statusFilter, currentPage, pageSize]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleExportToExcel = async () => {
    if (allFilteredAds.length === 0) return;

    // Sort alphabetically by Ad Title
    const sortedAds = [...allFilteredAds].sort((a, b) =>
      a.title.localeCompare(b.title, 'en', { sensitivity: 'base' })
    );

    const dataToExport = sortedAds.map((ad) => ({
      'Ad Title': ad.title,
      'Advertiser Name': ad.user?.name || '-',
      'Advertiser Email': ad.user?.email || '-',
      'From Date': formatDate(ad.fromDate),
      'To Date': formatDate(ad.toDate),
      Status: ad.status,
      'Views Count': ad.viewCount,
      'Days Left': ad.daysLeft ?? '-',
      'Created On': formatDate(ad.createdAt)
    }));

    await exportToExcel(dataToExport, 'Ads', 'ads-report');
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Ads Reports</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded shadow">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
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
            <table className="min-w-full border border-gray-200 rounded">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Sl.No</th>
                  <th className="px-4 py-2 border">Ad Title</th>
                  <th className="px-4 py-2 border">Advertiser</th>
                  <th className="px-4 py-2 border">From</th>
                  <th className="px-4 py-2 border">To</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Views</th>
                  <th className="px-4 py-2 border">Days Left</th>
                </tr>
              </thead>
              <tbody>
                {ads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-4">
                      No ads found
                    </td>
                  </tr>
                ) : (
                  ads.map((ad, index) => (
                    <tr key={ad.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-2 border">{ad.title}</td>
                      <td className="px-4 py-2 border">
                        {ad.user?.name || '-'}
                      </td>
                      <td className="px-4 py-2 border">
                        {formatDate(ad.fromDate)}
                      </td>
                      <td className="px-4 py-2 border">
                        {formatDate(ad.toDate)}
                      </td>
                      <td className="px-4 py-2 border capitalize">
                        {ad.status}
                      </td>
                      <td className="px-4 py-2 border">{ad.viewCount}</td>
                      <td className="px-4 py-2 border">
                        {ad.daysLeft ? `${ad.daysLeft} days` : '-'}
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
