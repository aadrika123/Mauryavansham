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

export default function MatrimonialReports() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    city: '',
    state: '',
    mobile: '',
    dateFrom: '',
    dateTo: ''
  });

  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const totalPages = Math.ceil(totalCount / pageSize);

  // ✅ Always visible columns
  const basicColumns = [
    { key: 'name', label: 'Name' },
    { key: 'gender', label: 'Gender' },
    { key: 'phoneNo', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'createdAt', label: 'Created At' }
  ];

  const optionalColumns = [
    { key: 'aboutMe', label: 'About Me' },
    { key: 'ancestralVillage', label: 'Ancestral Village' },
    { key: 'annualIncome', label: 'Annual Income' },
    { key: 'bodyType', label: 'Body Type' },
    { key: 'brothers', label: 'Brothers' },
    { key: 'castPreferences', label: 'Cast Preferences' },
    { key: 'collegeUniversity', label: 'College / University' },
    { key: 'communityContributions', label: 'Community Contributions' },
    { key: 'companyOrganization', label: 'Company / Organization' },
    { key: 'complexion', label: 'Complexion' },
    { key: 'deactivateReason', label: 'Deactivate Reason' },
    { key: 'deactivateReview', label: 'Deactivate Review' },
    { key: 'designation', label: 'Designation' },
    { key: 'diet', label: 'Diet' },
    { key: 'dob', label: 'DOB' },
    { key: 'drinking', label: 'Drinking' },
    { key: 'exercise', label: 'Exercise' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'familyHistory', label: 'Family History' },
    { key: 'familyIncome', label: 'Family Income' },
    { key: 'familyTraditions', label: 'Family Traditions' },
    { key: 'fatherName', label: 'Father Name' },
    { key: 'fatherOccupation', label: 'Father Occupation' },
    { key: 'gotraDetails', label: 'Gotra Details' },
    { key: 'height', label: 'Height' },
    { key: 'highestEducation', label: 'Highest Education' },
    { key: 'hobbies', label: 'Hobbies' },
    { key: 'instagram', label: 'Instagram' },
    // { key: "isActive", label: "Is Active" },
    // { key: "isDeleted", label: "Is Deleted" },
    // { key: "isPremium", label: "Is Premium" },
    // { key: "isVerified", label: "Is Verified" },
    { key: 'languagesKnown', label: 'Languages Known' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'maritalStatus', label: 'Marital Status' },
    { key: 'motherName', label: 'Mother Name' },
    { key: 'motherOccupation', label: 'Mother Occupation' },
    { key: 'moviePreferences', label: 'Movie Preferences' },
    { key: 'musicPreferences', label: 'Music Preferences' },
    { key: 'nickName', label: 'Nick Name' },
    { key: 'occupation', label: 'Occupation' },
    { key: 'profileImage', label: 'Profile Image' },
    { key: 'profileRelation', label: 'Profile Relation' },
    { key: 'readingInterests', label: 'Reading Interests' },
    { key: 'religiousBeliefs', label: 'Religious Beliefs' },
    { key: 'sisters', label: 'Sisters' },
    { key: 'smoking', label: 'Smoking' },
    { key: 'state', label: 'State' },
    { key: 'travelInterests', label: 'Travel Interests' },
    { key: 'updatedAt', label: 'Updated At' },
    { key: 'website', label: 'Website' },
    { key: 'weight', label: 'Weight' },
    { key: 'workExperience', label: 'Work Experience' },
    { key: 'workLocation', label: 'Work Location' }
  ];

  // 🔹 Fetch profiles
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        ...filters,
        page: String(currentPage),
        limit: String(pageSize)
      });

      const res = await fetch(`/api/reports/matrimonial?${query.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProfiles(data.data);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching matrimonial reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [currentPage, pageSize]);

  const handleFilterChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProfiles();
  };

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

  // 🔹 Export to Excel
  const handleExportToExcel = async () => {
    if (profiles.length === 0) return;

    const dataToExport = profiles.map((p: any, index: number) => {
      const u = p.users || {};
      const prof = p.profiles || {};

      return {
        '#': index + 1,
        Name: prof.name,
        'Profile Relation': prof.profileRelation,
        'Created By': u.name || '—',
        Gender: prof.gender,
        Phone: prof.phoneNo,
        Email: prof.email,
        'Created At': prof.createdAt
          ? new Date(prof.createdAt).toLocaleDateString()
          : '—'
      };
    });

    await exportToExcel(
      dataToExport,
      'Matrimonial Report',
      'matrimonial-report'
    );
  };

  if (loading) return <Loader />;

  // Merge visible columns
  const visibleColumns = [
    ...basicColumns,
    ...optionalColumns.filter((col) => selectedColumns.includes(col.key))
  ];

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Matrimonial Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 🔍 Filters */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
            <Input
              name="search"
              placeholder="Search by name/email"
              value={filters.search}
              onChange={handleFilterChange}
            />
            <Input
              name="city"
              placeholder="City"
              value={filters.city}
              onChange={handleFilterChange}
            />
            <Input
              name="state"
              placeholder="State"
              value={filters.state}
              onChange={handleFilterChange}
            />
            <Input
              name="mobile"
              placeholder="Mobile"
              value={filters.mobile}
              onChange={handleFilterChange}
            />
            <Input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
            />
            <Input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
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

          {/* 🧩 Column selector */}
          <div className="border p-3 rounded-md mb-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="cursor-pointer"
              />
              <span className="font-medium">Select All Columns</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2">
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
                  <span>{col.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 🧾 Table */}
          {profiles.length === 0 ? (
            <p className="text-center py-4">No profiles found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2">#</th>
                    {visibleColumns.map((col) => (
                      <th key={col.key} className="border px-4 py-2">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p: any, index: number) => {
                    const u = p.users || {};
                    const prof = p.profiles || {};
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{index + 1}</td>
                        {visibleColumns.map((col) => {
                          let value = '';
                          if (col.key === 'createdBy') value = u.name || '—';
                          else if (col.key === 'createdAt')
                            value = prof.createdAt
                              ? new Date(prof.createdAt).toLocaleDateString()
                              : '—';
                          else value = prof[col.key] || '—';

                          return (
                            <td key={col.key} className="border px-4 py-2">
                              {value}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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
