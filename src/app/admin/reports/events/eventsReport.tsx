'use client';

import { useState, useEffect } from 'react';
import { exportToExcel } from '@/src/utils/exportExcel';
import Loader from '@/src/components/ui/loader';
import Pagination from '@/src/components/common/Pagination';

interface Event {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  userName?: string;
  attendeesCount?: number;
  fromTime: string;
  toTime: string;
  type: string;
  attendees?: {
    name: string;
    email: string;
    phone?: string;
  }[];
  date: string;
  rejectedBy?: string;
  reason?: string;
  organizerInfo: {
    name: string;
    email: string;
  };
}

export default function EventReportsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [allFilteredEvents, setAllFilteredEvents] = useState<Event[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / pageSize);

  // ✅ Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '1000');
        if (statusFilter) params.append('status', statusFilter);

        const res = await fetch(`/api/events?${params.toString()}`);
        const data = await res.json();

        const eventData = data || [];
        setAllFilteredEvents(eventData);
        setTotalCount(eventData.length);
        setEvents(eventData.slice((currentPage - 1) * pageSize, currentPage * pageSize));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [statusFilter, currentPage, pageSize]);

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
    if (allFilteredEvents.length === 0) return;

    // Sort alphabetically by title
    const sortedEvents = [...allFilteredEvents].sort((a, b) =>
      a.title.localeCompare(b.title, 'en', { sensitivity: 'base' })
    );

    const dataToExport = sortedEvents.map(e => ({
      'Event Title': e.title,
      Description: e.description || '-',
      'Event Date': formatDate(e.eventDate),
      'Event Time': `${e.fromTime} - ${e.toTime}`,
      'Event Type': e.type,
      Location: e.location || '-',
      'Created By': e.organizerInfo.name || '-',
      'Total Attendees': e.attendeesCount || 0,
      'Attendee Names': e.attendees?.map(a => a.name).join(', ') || '-',
      'Created On': formatDate(e.createdAt),
      Status: e.status || '-',
      'Rejected By': e.rejectedBy || '-',
      'Rejection Reason': e.reason || '-'
    }));

    await exportToExcel(dataToExport, 'Events', 'events-report');
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Events Reports</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded shadow">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
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
          {/* Table */}
          <div className="overflow-x-auto bg-white p-4 rounded shadow">
            <table className="min-w-full border border-gray-200 rounded text-xs">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Sl.No</th>
                  <th className="px-4 py-2 border">Event Title</th>
                  <th className="px-4 py-2 border  sm:table-cell">Description</th>
                  <th className="px-4 py-2 border">Event Date</th>
                  <th className="px-4 py-2 border  md:table-cell">Event from</th>
                  <th className="px-4 py-2 border  md:table-cell">Event to</th>
                  <th className="px-4 py-2 border  lg:table-cell">Event Type</th>
                  <th className="px-4 py-2 border">Location</th>
                  <th className="px-4 py-2 border  sm:table-cell">Created By</th>
                  <th className="px-4 py-2 border">Attendees Count</th>
                  <th className="px-4 py-2 border  sm:table-cell">Created On</th>
                  <th className="px-4 py-2 border  md:table-cell">Status</th>
                  <th className="px-4 py-2 border  lg:table-cell">Rejected By</th>
                  <th className="px-4 py-2 border  lg:table-cell">Rejected Reason</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="text-center p-4">
                      No events found
                    </td>
                  </tr>
                ) : (
                  events.map((e, index) => (
                    <tr key={e.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className="px-4 py-2 border">{e.title}</td>
                      <td className="px-4 py-2 border  sm:table-cell">{e.description || '-'}</td>
                      <td className="px-4 py-2 border">{formatDate(e.date)}</td>
                      <td className="px-4 py-2 border  md:table-cell">{e.fromTime}</td>
                      <td className="px-4 py-2 border  md:table-cell">{e.toTime}</td>
                      <td className="px-4 py-2 border  lg:table-cell">{e.type}</td>
                      <td className="px-4 py-2 border">{e.location || '-'}</td>
                      <td className="px-4 py-2 border  sm:table-cell">{e.organizerInfo.name || '-'}</td>
                      <td className="px-4 py-2 border text-center">{e.attendeesCount || 0}</td>
                      <td className="px-4 py-2 border  sm:table-cell">{formatDate(e.createdAt)}</td>
                      <td className="px-4 py-2 border  md:table-cell capitalize">{e.status || '-'}</td>
                      <td className="px-4 py-2 border  lg:table-cell">{e.rejectedBy || '-'}</td>
                      <td className="px-4 py-2 border  lg:table-cell">{e.reason || '-'}</td>
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
