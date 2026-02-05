'use client';

import { useState, useEffect } from 'react';
import { exportToExcel } from '@/src/utils/exportExcel';
import Loader from '@/src/components/ui/loader';
import Pagination from '@/src/components/common/Pagination';

interface Blog {
  id: number;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft' | 'removed';
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  removeReason?: string;
  removedByName?: string;
  author?: {
    name: string;
    email: string;
  };
}

export default function BlogsReportPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [allFilteredBlogs, setAllFilteredBlogs] = useState<Blog[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '1000');
        if (statusFilter) params.append('status', statusFilter);

        const res = await fetch(`/api/blogs?${params.toString()}`);
        const data = await res.json();

        const blogData = data.blogs || [];
        setAllFilteredBlogs(blogData);
        setTotalCount(blogData.length);
        setBlogs(blogData.slice((currentPage - 1) * pageSize, currentPage * pageSize));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
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
    if (allFilteredBlogs.length === 0) return;

    // Sort alphabetically by title
    const sortedBlogs = [...allFilteredBlogs].sort((a, b) =>
      a.title.localeCompare(b.title, 'en', { sensitivity: 'base' })
    );

    const dataToExport = sortedBlogs.map(b => ({
      'Blog Title': b.title,
      'Author Name': b.author?.name || '-',
      'Author Email': b.author?.email || '-',
      Status: b.status,
      Summary: b.summary,
      Content: b.content,
      'Created On': formatDate(b.createdAt),
      'Approved On': formatDate(b.approvedAt || ''),
      'Rejection Reason': b.rejectionReason || '-',
      'Removed By': b.removedByName || '-',
      'Remove Reason': b.removeReason || '-'
    }));

    await exportToExcel(dataToExport, 'Blogs', 'blogs-report');
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Blogs Reports</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded shadow">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
          <option value="removed">Removed</option>
        </select>

        <button onClick={handleExportToExcel} className="bg-green-500 text-white px-4 py-2 rounded">
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
                  <th className="px-4 py-2 border">Blog Title</th>
                  <th className="px-4 py-2 border">Author</th>
                  <th className="px-4 py-2 border">Title</th>
                  {/* <th className="px-4 py-2 border">Content</th> */}
                  <th className="px-4 py-2 border">Summary</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Created On</th>
                  <th className="px-4 py-2 border">Approved On</th>
                  <th className="px-4 py-2 border">Rejection Reason</th>
                  <th className="px-4 py-2 border">Removed By</th>
                  <th className="px-4 py-2 border">Remove Reason</th>
                </tr>
              </thead>
              <tbody>
                {blogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      No blogs found
                    </td>
                  </tr>
                ) : (
                  blogs.map((b, index) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className="px-4 py-2 border">{b.title}</td>
                      <td className="px-4 py-2 border">{b.author?.name || '-'}</td>
                      <td className="px-4 py-2 border">{b.title}</td>
                      {/* <td className="px-4 py-2 border truncate">{b.content}</td> */}
                      <td className="px-4 py-2 border">{b.summary}</td>
                      <td className="px-4 py-2 border capitalize">{b.status}</td>
                      <td className="px-4 py-2 border">{formatDate(b.createdAt)}</td>
                      <td className="px-4 py-2 border">{formatDate(b.approvedAt || '')}</td>
                      <td className="px-4 py-2 border">{b.rejectionReason || '-'}</td>
                      <td className="px-4 py-2 border">{b.removedByName || '-'}</td>
                      <td className="px-4 py-2 border">{b.removeReason || '-'}</td>
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
            onPageChange={page => setCurrentPage(page)}
            onPageSizeChange={size => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </>
      )}
    </div>
  );
}
