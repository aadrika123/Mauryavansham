"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import Loader from "@/src/components/ui/loader";
import Pagination from "@/src/components/common/Pagination";
import * as XLSX from "xlsx";

export default function MatrimonialReports() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    city: "",
    state: "",
    mobile: "",
    dateFrom: "",
    dateTo: "",
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  // 🔹 Fetch profiles from API
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        ...filters,
        page: String(currentPage),
        limit: String(pageSize),
      });

      const res = await fetch(`/api/reports/matrimonial?${query.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProfiles(data.data);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error("Error fetching matrimonial reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [currentPage, pageSize]);

  // 🔹 Handle input change
  const handleFilterChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProfiles();
  };

  // 🔹 Export to Excel
  const exportToExcel = () => {
  if (profiles.length === 0) return;

  const dataToExport = profiles.map((p: any, index: number) => {
    const u = p.users || {};
    const prof = p.profiles || {};

    return {
      "#": index + 1,
      "Name": prof.name,
      "Profile Relation": prof.profileRelation,
      "Created By": u.name || "—",
      "Nick Name": prof.nickName,
      "Phone": prof.phoneNo,
      "Gender": prof.gender,
      "Email": prof.email,
      "Website": prof.website,
      "DOB": prof.dob,
      "Height": prof.height,
      "Weight": prof.weight,
      "Complexion": prof.complexion,
      "Body Type": prof.bodyType,
      "Marital Status": prof.maritalStatus,
      "Languages Known": prof.languagesKnown,
      "Hobbies": prof.hobbies,
      "About Me": prof.aboutMe,
      "Highest Education": prof.highestEducation,
      "College / University": prof.collegeUniversity,
      "Occupation": prof.occupation,
      "Company / Organization": prof.companyOrganization,
      "Designation": prof.designation,
      "Work Location": prof.workLocation,
      "Annual Income": prof.annualIncome,
      "Work Experience": prof.workExperience,
      "Father Name": prof.fatherName,
      "Father Occupation": prof.fatherOccupation,
      "Mother Name": prof.motherName,
      "Mother Occupation": prof.motherOccupation,
      "Brothers": prof.brothers,
      "Sisters": prof.sisters,
      "Family Income": prof.familyIncome,
      "Gotra Details": prof.gotraDetails,
      "Ancestral Village": prof.ancestralVillage,
      "Family History": prof.familyHistory,
      "Community Contributions": prof.communityContributions,
      "Family Traditions": prof.familyTraditions,
      "Diet": prof.diet,
      "Smoking": prof.smoking,
      "Drinking": prof.drinking,
      "Exercise": prof.exercise,
      "Religious Beliefs": prof.religiousBeliefs,
      "Music Preferences": prof.musicPreferences,
      "Movie Preferences": prof.moviePreferences,
      "Reading Interests": prof.readingInterests,
      "Travel Interests": prof.travelInterests,
      "Cast Preferences": prof.castPreferences,
      "Facebook": prof.facebook,
      "Instagram": prof.instagram,
      "LinkedIn": prof.linkedin,
      "Profile Image": prof.profileImage || "—",
      "Created At": prof.createdAt ? new Date(prof.createdAt).toLocaleDateString() : "—",
      "Updated At": prof.updatedAt ? new Date(prof.updatedAt).toLocaleDateString() : "—",
      "Is Premium": prof.isPremium ? "Yes" : "No",
      "Is Verified": prof.isVerified ? "Yes" : "No",
      "Is Active": prof.isActive ? "Yes" : "No",
      "Is Deleted": prof.isDeleted ? "Yes" : "No",
      "Deactivate Reason": prof.deactivateReason || "—",
      "Deactivate Review": prof.deactivateReview || "—",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Matrimonial Report");
  XLSX.writeFile(workbook, "matrimonial-report.xlsx");
};


  if (loading) return <Loader />;
  {
    console.log(profiles);
  }

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
            <Button onClick={exportToExcel} variant="outline">
              Export to Excel
            </Button>
          </div>
          {/* 🧾 Table View */}
          {profiles.length === 0 ? (
            <p className="text-center py-4">No profiles found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100 text-left font-semibold">
                  <tr>
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Profile Relation</th>
                    <th className="border px-4 py-2">Created By</th>
                    <th className="border px-4 py-2">Nick Name</th>
                    <th className="border px-4 py-2">Phone</th>
                    <th className="border px-4 py-2">Gender</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Website</th>
                    <th className="border px-4 py-2">DOB</th>
                    <th className="border px-4 py-2">Height</th>
                    <th className="border px-4 py-2">Weight</th>
                    <th className="border px-4 py-2">Complexion</th>
                    <th className="border px-4 py-2">Body Type</th>
                    <th className="border px-4 py-2">Marital Status</th>
                    <th className="border px-4 py-2">Languages Known</th>
                    <th className="border px-4 py-2">Hobbies</th>
                    <th className="border px-4 py-2">About Me</th>
                    <th className="border px-4 py-2">Highest Education</th>
                    <th className="border px-4 py-2">College / University</th>
                    <th className="border px-4 py-2">Occupation</th>
                    <th className="border px-4 py-2">Company / Organization</th>
                    <th className="border px-4 py-2">Designation</th>
                    <th className="border px-4 py-2">Work Location</th>
                    <th className="border px-4 py-2">Annual Income</th>
                    <th className="border px-4 py-2">Work Experience</th>
                    <th className="border px-4 py-2">Father Name</th>
                    <th className="border px-4 py-2">Father Occupation</th>
                    <th className="border px-4 py-2">Mother Name</th>
                    <th className="border px-4 py-2">Mother Occupation</th>
                    <th className="border px-4 py-2">Brothers</th>
                    <th className="border px-4 py-2">Sisters</th>
                    <th className="border px-4 py-2">Family Income</th>
                    <th className="border px-4 py-2">Gotra Details</th>
                    <th className="border px-4 py-2">Ancestral Village</th>
                    <th className="border px-4 py-2">Family History</th>
                    <th className="border px-4 py-2">
                      Community Contributions
                    </th>
                    <th className="border px-4 py-2">Family Traditions</th>
                    <th className="border px-4 py-2">Diet</th>
                    <th className="border px-4 py-2">Smoking</th>
                    <th className="border px-4 py-2">Drinking</th>
                    <th className="border px-4 py-2">Exercise</th>
                    <th className="border px-4 py-2">Religious Beliefs</th>
                    <th className="border px-4 py-2">Music Preferences</th>
                    <th className="border px-4 py-2">Movie Preferences</th>
                    <th className="border px-4 py-2">Reading Interests</th>
                    <th className="border px-4 py-2">Travel Interests</th>
                    <th className="border px-4 py-2">Cast Preferences</th>
                    <th className="border px-4 py-2">Facebook</th>
                    <th className="border px-4 py-2">Instagram</th>
                    <th className="border px-4 py-2">LinkedIn</th>
                    <th className="border px-4 py-2">Profile Image</th>
                    <th className="border px-4 py-2">Created At</th>
                    <th className="border px-4 py-2">Updated At</th>
                    <th className="border px-4 py-2">Is Premium</th>
                    <th className="border px-4 py-2">Is Verified</th>
                    <th className="border px-4 py-2">Is Active</th>
                    <th className="border px-4 py-2">Is Deleted</th>
                    <th className="border px-4 py-2">Deactivate Reason</th>
                    <th className="border px-4 py-2">Deactivate Review</th>
                  </tr>
                </thead>

                <tbody>
                  {profiles.map((p: any, index: number) => {
                    const u = p.users; // Users object
                    console.log(p.profiles);
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{p.profiles.name}</td>
                        <td className="border px-4 py-2">
                          {p.profiles.profileRelation}
                        </td>
                        <td className="border px-4 py-2">{u?.name || "—"}</td>
                        <td className="border px-4 py-2">{p.profiles.nickName}</td>
                        <td className="border px-4 py-2">{p.profiles.phoneNo}</td>
                        <td className="border px-4 py-2">{p.profiles.gender}</td>
                        <td className="border px-4 py-2">{p.profiles.email}</td>
                        <td className="border px-4 py-2">{p.profiles.website}</td>
                        <td className="border px-4 py-2">{p.profiles.dob}</td>
                        <td className="border px-4 py-2">{p.profiles.height}</td>
                        <td className="border px-4 py-2">{p.profiles.weight}</td>
                        <td className="border px-4 py-2">{p.profiles.complexion}</td>
                        <td className="border px-4 py-2">{p.profiles.bodyType}</td>
                        <td className="border px-4 py-2">{p.profiles.maritalStatus}</td>
                        <td className="border px-4 py-2">{p.profiles.languagesKnown}</td>
                        <td className="border px-4 py-2">{p.profiles.hobbies}</td>
                        <td className="border px-4 py-2">{p.profiles.aboutMe}</td>
                        <td className="border px-4 py-2">
                          {p.profiles.highestEducation}
                        </td>
                        <td className="border px-4 py-2">
                          {p.profiles.collegeUniversity}
                        </td>
                        <td className="border px-4 py-2">{p.profiles.occupation}</td>
                        <td className="border px-4 py-2">
                          {p.profiles.companyOrganization}
                        </td>
                        <td className="border px-4 py-2">{p.profiles.designation}</td>
                        <td className="border px-4 py-2">{p.profiles.workLocation}</td>
                        <td className="border px-4 py-2">{p.profiles.annualIncome}</td>
                        <td className="border px-4 py-2">{p.profiles.workExperience}</td>
                        <td className="border px-4 py-2">{p.profiles.fatherName}</td>
                        <td className="border px-4 py-2">
                          {p.profiles.fatherOccupation}
                        </td>
                        <td className="border px-4 py-2">{p.profiles.motherName}</td>
                        <td className="border px-4 py-2">
                          {p.profiles.motherOccupation}
                        </td>
                        <td className="border px-4 py-2">{p.profiles.brothers}</td>
                        <td className="border px-4 py-2">{p.profiles.sisters}</td>
                        <td className="border px-4 py-2">{p.profiles.familyIncome}</td>
                        <td className="border px-4 py-2">{p.profiles.gotraDetails}</td>
                        <td className="border px-4 py-2">
                          {p.profiles.ancestralVillage}
                        </td>
                        <td className="border px-4 py-2">{p.profiles.familyHistory}</td>
                        <td className="border px-4 py-2">
                          {p.profiles.communityContributions}
                        </td>
                        <td className="border px-4 py-2">
                          {p.profiles.familyTraditions}
                        </td>
                        <td className="border px-4 py-2">{p.profiles.diet}</td>
                        <td className="border px-4 py-2">{p.profiles.smoking}</td>
                        <td className="border px-4 py-2">{p.profiles.drinking}</td>
                        <td className="border px-4 py-2">{p.profiles.exercise}</td>
                        <td className="border px-4 py-2">
                          {p.profiles.religiousBeliefs}
                        </td>
                        <td className="border px-4 py-2">
                          {p.profiles.musicPreferences}
                        </td>
                        <td className="border px-4 py-2">
                          {p.profiles.moviePreferences}
                        </td>
                        <td className="border px-4 py-2">
                          {p.profiles.readingInterests}
                        </td>
                        <td className="border px-4 py-2">
                          {p.profiles.travelInterests}
                        </td>
                        <td className="border px-4 py-2">
                          {p.profiles.castPreferences}
                        </td>
                        <td className="border px-4 py-2">{p.profiles.facebook}</td>
                        <td className="border px-4 py-2">{p.profiles.instagram}</td>
                        <td className="border px-4 py-2">{p.profiles.linkedin}</td>
                        <td className="border px-4 py-2">
                          {p.profiles.profileImage && (
                            <img
                              src={p.profiles.profileImage}
                              alt="Profile"
                              className="w-16 h-16 object-cover"
                            />
                          )}
                        </td>
                        <td className="border px-4 py-2">
                          {new Date(p.profiles.createdAt).toLocaleDateString()}
                        </td>
                        <td className="border px-4 py-2">
                          {new Date(p.profiles.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="border px-4 py-2">
                          {p.profiles.isPremium ? "Yes" : "No"}
                        </td>
                        <td className="border px-4 py-2">
                          {p.profiles.isVerified ? "Yes" : "No"}
                        </td>
                        <td className="border px-4 py-2">
                          {p.profiles.isActive ? "Yes" : "No"}
                        </td>
                        <td className="border px-4 py-2">
                          {p.profiles.isDeleted ? "Yes" : "No"}
                        </td>
                        <td className="border px-4 py-2">
                          {p.profiles.deactivateReason || "—"}
                        </td>
                        <td className="border px-4 py-2">
                          {p.profiles.deactivateReview || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🔢 Pagination */}
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
