'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import Loader from '@/src/components/ui/loader';
import Pagination from '@/src/components/common/Pagination';
import { exportToExcel } from '@/src/utils/exportExcel';

interface Discussion {
  id: number;
  title: string;
  content: string;
  category: string;
  authorName: string;
  location?: string;
  likes: number;
  replies: number;
  status: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  repliesCount: number;
}

export default function DiscussionReports() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  // 🔹 Fetch discussions
  const fetchDiscussions = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
        ...filters
      });

      const res = await fetch(`/api/reports/discussions?${query.toString()}`);
      const data = await res.json();

      if (data.success) {
        setDiscussions(data.data);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching discussions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [currentPage, pageSize]);

  const handleFilterChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchDiscussions();
  };

  // 🔹 Export to Excel
  const handleExportToExcel = async () => {
    if (discussions.length === 0) return;

    const dataToExport = discussions.map((d) => ({
      Title: d.title,
      Content: d.content,
      Category: d.category,
      Author: d.authorName,
      Location: d.location || '',
      Likes: d.likesCount,
      Replies: d.repliesCount,
      Status: d.status,
      ApprovedBy: d.approvedBy || '',
      ApprovedAt: d.approvedAt ? new Date(d.approvedAt).toLocaleString() : '',
      RejectedBy: d.rejectedBy || '',
      RejectedAt: d.rejectedAt ? new Date(d.rejectedAt).toLocaleString() : '',
      RejectionReason: d.rejectionReason || '',
      Completed: d.isCompleted ? 'Yes' : 'No',
      CreatedAt: new Date(d.createdAt).toLocaleString(),
      UpdatedAt: new Date(d.updatedAt).toLocaleString()
    }));

    await exportToExcel(dataToExport, 'Discussion Report', 'discussion-report');
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Discussion Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <Input
              name="search"
              placeholder="Search by title/content"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <Input
              name="category"
              placeholder="Category"
              value={filters.category}
              onChange={handleFilterChange}
            />
            <Input
              name="status"
              placeholder="Status"
              value={filters.status}
              onChange={handleFilterChange}
            />
            <Input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
              placeholder="From Date"
            />
            <Input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
              placeholder="To Date"
            />
          </div>

          <div className="flex gap-4 mb-4">
            <Button
              onClick={handleSearch}
              className="bg-[#8B0000] text-white hover:bg-[#a30a0a]"
            >
              Apply Filters
            </Button>
            <Button onClick={handleExportToExcel} variant="outline">
              Export to Excel
            </Button>
          </div>

          {/* Table */}
          {discussions.length === 0 ? (
            <p className="text-center py-4">No discussions found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100 text-left font-semibold">
                  <tr>
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">Title</th>
                    <th className="border px-4 py-2">Category</th>
                    <th className="border px-4 py-2">Author</th>
                    <th className="border px-4 py-2">Location</th>
                    <th className="border px-4 py-2">Likes</th>
                    <th className="border px-4 py-2">Replies</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Approved By</th>
                    <th className="border px-4 py-2">Approved At</th>
                    <th className="border px-4 py-2">Rejected By</th>
                    <th className="border px-4 py-2">Rejected At</th>
                    <th className="border px-4 py-2">Rejection Reason</th>
                    <th className="border px-4 py-2">Completed</th>
                    <th className="border px-4 py-2">Created At</th>
                    <th className="border px-4 py-2">Updated At</th>
                  </tr>
                </thead>

                <tbody>
                  {discussions.map((d, index) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{d.title}</td>
                      <td className="border px-4 py-2">{d.category}</td>
                      <td className="border px-4 py-2">{d.authorName}</td>
                      <td className="border px-4 py-2">{d.location || '—'}</td>
                      <td className="border px-4 py-2">{d.likesCount}</td>
                      <td className="border px-4 py-2">{d.repliesCount}</td>
                      <td className="border px-4 py-2">{d.status}</td>
                      <td className="border px-4 py-2">
                        {d.approvedBy || '—'}
                      </td>
                      <td className="border px-4 py-2">
                        {d.approvedAt
                          ? new Date(d.approvedAt).toLocaleString()
                          : '—'}
                      </td>
                      <td className="border px-4 py-2">
                        {d.rejectedBy || '—'}
                      </td>
                      <td className="border px-4 py-2">
                        {d.rejectedAt
                          ? new Date(d.rejectedAt).toLocaleString()
                          : '—'}
                      </td>
                      <td className="border px-4 py-2">
                        {d.rejectionReason || '—'}
                      </td>
                      <td className="border px-4 py-2">
                        {d.isCompleted ? 'Yes' : 'No'}
                      </td>
                      <td className="border px-4 py-2">
                        {new Date(d.createdAt).toLocaleString()}
                      </td>
                      <td className="border px-4 py-2">
                        {new Date(d.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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
    </div>
  );
}
