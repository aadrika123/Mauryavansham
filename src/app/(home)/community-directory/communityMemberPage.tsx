'use client';

import { Button } from '@/src/components/ui/button';
import Loader from '@/src/components/ui/loader';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  photo: string | null;
  userCode: string;
  city?: string;
  designation?: string;
  professionGroup?: string;
  profession?: string;
  email: string;
  phone?: string;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  dob?: string;
  maritalStatus?: string;
  education?: string;
  occupation?: string;
  gender?: string;
  jobType?: string;
  govSector?: string;
  department?: string;
  postingLocation?: string;
  businessDetails?: string;
  professionDetails?: string;
  facebookLink?: string;
  dateOfBirth?: string;
  aboutMe?: string;
  company?: string;
}

export default function CommunityMemberPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 20; // 5x4 grid = 20 per page
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');
  const [reason, setReason] = useState('');
  const [popup, setPopup] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/users/active', {
          method: 'GET',
          credentials: 'include'
        });

        if (res.ok) {
          const data: User[] = await res.json();
          setUsers(data);
        } else {
          console.error('Failed to load users');
        }
      } catch (error) {
        console.error('Error loading users', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const start = page * pageSize;

  // 🔎 Filtered + Paginated users
  const filteredUsers = users.filter(u =>
    [u.name, u.userCode, u.city, u.profession]
      .filter(Boolean)
      .some(field => field?.toLowerCase().includes(search.toLowerCase()))
  );

  const currentUsers = filteredUsers.slice(start, start + pageSize);

  const handleConnect = async () => {
    if (!selectedUser || !session?.user || !reason.trim()) return;

    const user = session.user as any;
    const message = `${user.name} wants to connect with you.\n\nMessage: ${reason}`;

    try {
      setSending(true);

      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          type: 'profile_connect',
          message,
          currentUser: user
        })
      });

      const data = await res.json();

      if (res.status === 409) {
        setPopup({
          message:
            data.message || 'You are already connected with this user. You can go to your inbox to chat with them.',
          visible: true
        });
      } else if (res.ok) {
        setPopup({
          message: 'Connection request sent successfully! You can check your inbox for updates.',
          visible: true
        });
        setSelectedUser(null);
        setReason('');
      } else {
        setPopup({
          message: data.error || 'Failed to send request. Please try again.',
          visible: true
        });
      }
    } catch (err) {
      console.error(err);
      setPopup({
        message: 'Something went wrong. Please try again later.',
        visible: true
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-10 bg-[#FFFDEF]">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-[#8B0000] mb-6 text-center underline">Know Your Community Members</h2>

        {/* 🔎 Search */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by name, ID, city, or profession..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader />
          </div>
        ) : (
          <>
            {/* 5x4 Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {currentUsers.map(user => (
                <div
                  key={user.id}
                  className="cursor-pointer rounded-lg p-3 hover:shadow-[#ffd500] hover:shadow-lg bg-[#FFF8DE] border border-[#FFF6D5] transition text-center text-sm"
                >
                  <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden border">
                    <Image
                      src={user.photo || '/default-avatar.png'}
                      alt={user.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-800 truncate">{user.name}</h3>
                  <p className="text-gray-600 truncate">{user.userCode}</p>
                  <p className="text-gray-600 truncate">{user.city}</p>
                  <p className="text-gray-600 truncate">
                    {user.profession ? `${user.professionGroup} - ${user.profession}` : user.designation}
                  </p>

                  <Button
                    onClick={() => setSelectedUser(user)}
                    className="mt-2 text-orange-600 hover:text-orange-800 bg-transparent hover:bg-yellow-100 border border-yellow-300 hover:border-yellow-400 px-2 py-1 text-xs rounded"
                  >
                    Know More
                  </Button>
                </div>
              ))}
            </div>

            {/* Prev / Next buttons */}
            {/* Prev / Next buttons with page number */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() => setPage(p => p - 1)}
                disabled={page === 0}
                className="px-4 py-2 bg-[#8B0000] text-white rounded disabled:opacity-50"
              >
                ← Prev
              </button>

              {/* Page number display */}
              <span className="text-gray-700 font-medium">
                Page {page + 1} of {Math.ceil(filteredUsers.length / pageSize)}
              </span>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={start + pageSize >= filteredUsers.length}
                className="px-4 py-2 bg-[#8B0000] text-white rounded disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Popup modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[90vh] overflow-y-auto">
            {/* Profile Image */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border mb-2">
                <Image
                  src={selectedUser.photo || '/default-avatar.png'}
                  alt={selectedUser.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              {selectedUser.name && <h2 className="text-xl font-bold">{selectedUser.name}</h2>}
              {selectedUser.userCode && <p className="text-gray-500">{selectedUser.userCode}</p>}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
              {[
                { label: 'Gender', value: selectedUser.gender },
                {
                  label: 'DOB',
                  value: selectedUser.dateOfBirth
                    ? (() => {
                        const date = new Date(selectedUser.dateOfBirth);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        return `${day}/${month}/xxxx`;
                      })()
                    : null
                },
                { label: 'Marital Status', value: selectedUser.maritalStatus },
                { label: 'Education', value: selectedUser.education },
                { label: 'Occupation', value: selectedUser.occupation },
                { label: 'Job Type', value: selectedUser.jobType },
                { label: 'Gov. Sector', value: selectedUser.govSector },
                { label: 'Department', value: selectedUser.department },
                {
                  label: 'Posting Location',
                  value: selectedUser.postingLocation
                },
                { label: 'Designation', value: selectedUser.designation },
                { label: 'Company', value: selectedUser.company },
                {
                  label: 'Profession Group',
                  value: selectedUser.professionGroup
                },
                { label: 'Profession', value: selectedUser.profession },
                {
                  label: 'Profession Details',
                  value: selectedUser.professionDetails
                },
                { label: 'Father’s Name', value: selectedUser.fatherName },
                { label: 'Mother’s Name', value: selectedUser.motherName },
                { label: 'Spouse Name', value: selectedUser.spouseName },
                {
                  label: 'Facebook',
                  value: selectedUser.facebookLink ? (
                    <a
                      href={selectedUser.facebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-block max-w-[150px] truncate"
                      title={selectedUser.facebookLink}
                    >
                      {selectedUser.facebookLink}
                    </a>
                  ) : null
                }
              ].map(
                (item, index) =>
                  item.value && (
                    <p key={index}>
                      <strong>{item.label}:</strong> {item.value}
                    </p>
                  )
              )}
            </div>

            {/* Reason to Connect */}
            <div className="mt-6">
              <label className="block text-sm font-semibold mb-2 text-gray-800">Why do you want to connect?</label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Write a short message..."
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#8B0000] focus:outline-none text-sm"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
              <Button onClick={handleConnect} disabled={sending || !reason.trim()}>
                {sending ? 'Sending...' : 'Connect'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {popup.visible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px] text-center">
            <p className="text-gray-800 text-base mb-4 whitespace-pre-line">{popup.message}</p>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setPopup({ message: '', visible: false });
                  setSelectedUser(null);
                }}
                className="bg-[#8B0000] text-white hover:bg-[#a30a0a]"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
