'use client';

import { useState, useEffect } from 'react';
import SummaryCard from '../components/SummaryCard';
import { Users } from 'lucide-react';
import Pagination from '@/src/components/common/Pagination';
import { exportToExcel } from '@/src/utils/exportExcel';
import Loader from '@/src/components/ui/loader';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
  status: 'active' | 'inactive';
  role: string;
  state: string;
  gender: string;
  fatherName: string;
  address: string;
}

export default function UsersReportsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [allFilteredUsers, setAllFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '1000'); // large number to get all filtered data
        if (search) params.append('search', search);
        if (roleFilter) params.append('role', roleFilter);
        if (cityFilter) params.append('city', cityFilter);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const res = await fetch(`/api/users?${params.toString()}`);
        const data = await res.json();

        setUsers(data.data.slice(0, pageSize)); // paginated
        setAllFilteredUsers(data.data); // full filtered data for export
        setTotalCount(data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // ✅ stop loader
      }
    };

    fetchUsers();
  }, [search, roleFilter, cityFilter, startDate, endDate, pageSize]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Export currently visible table data to Excel
  const handleExportToExcel = async () => {
    if (allFilteredUsers.length === 0) return;

    // 🔠 Sort alphabetically by name (case-insensitive)
    const sortedUsers = [...allFilteredUsers].sort((a, b) =>
      a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
    );

    const dataToExport = sortedUsers.map(u => ({
      Name: u.name,
      Email: u.email,
      Gender: u.gender,
      Phone: u.phone,
      "Father's Name": u.fatherName,
      Address: u.address,
      City: u.city,
      State: u.state,
      'Registration Date': formatDate(u.createdAt),
      Status: u.status,
      Role: u.role
    }));

    await exportToExcel(dataToExport, 'Users', 'users-report');
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader />
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Reports</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Search name, email, phone"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded"
        />

        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        {/* <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Cities</option>
          <option value="Patna">Patna</option>
          <option value="Delhi">Delhi</option>
        </select> */}

        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 rounded" />

        <button onClick={handleExportToExcel} className="bg-green-500 text-white px-4 py-2 rounded">
          Export Excel
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white p-4 rounded shadow">
        <table className="min-w-full border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Sl.No</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">City</th>
              <th className="px-4 py-2 border">Registration Date</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u, index) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{u.name}</td>
                  <td className="px-4 py-2 border">{u.email}</td>
                  <td className="px-4 py-2 border">{u.phone}</td>
                  <td className="px-4 py-2 border">{u.city}</td>
                  <td className="px-4 py-2 border">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-2 border">{u.status}</td>
                  <td className="px-4 py-2 border">{u.role}</td>
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
    </div>
  );
}
