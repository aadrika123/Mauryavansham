"use client";

import { Button } from "@/src/components/ui/button";
import Loader from "@/src/components/ui/loader";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

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
}

export default function CommunityMemberPage({ user }: { user: any }) {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 12;
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/active", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data: User[] = await res.json();
          setUsers(data);
        } else {
          console.error("Failed to load users");
        }
      } catch (error) {
        console.error("Error loading users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const start = page * pageSize;
  const currentUsers = users.slice(start, start + pageSize);

  const handleConnect = async () => {
    if (!selectedUser || !session?.user) return;
    const user = session.user as any;
    // const user = 12;
    const message = `${user.name} wants to connect with you .`;

    try {
      setSending(true);
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id, // owner id
          type: "profile_connect",
          message,
          currentUser: user,
        }),
      });

      if (res.ok) {
        alert("Connection request sent!");
        setSelectedUser(null);
      } else {
        alert("Failed to send request");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setSending(false);
    }
  };

  const handleNext = () => {
    if (start + pageSize < users.length) {
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };
  return (
    <section className="py-10 bg-[#FFFDEF]">
      <div className="container mx-auto">
        <h2 className="text-4xl underline font-bold text-[#8B0000] mb-6 text-center">
          Our Community Members
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            {/* <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#8B0000] border-t-transparent"></div> */}
            <Loader />
          </div>
        ) : (
          <>
            {/* Grid of 6 users */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              {currentUsers.map((user) => (
                <div
                  key={user.id}
                  className="cursor-pointer rounded-lg p-4 hover:shadow-[#ffd500] hover:shadow-lg bg-[#FFF8DE] border border-[#FFF6D5] transition text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border">
                    <Image
                      src={user.photo || "/default-avatar.png"}
                      alt={user.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {user.name}
                  </h3>
                  <p className="text-xs text-gray-600 truncate">
                    {user.userCode}
                  </p>
                  <p className="text-xs text-gray-600 truncate">{user.city}</p>
                  <p className="text-xs text-gray-600 truncate">
                    (
                    {user.profession
                      ? `${user.professionGroup} - ${user.profession}`
                      : user.designation}
                    )
                  </p>

                  <Button
                    //   onClick={handleConnect}
                    onClick={() => setSelectedUser(user)}
                    //   disabled={sending}
                    className="mt-2 text-orange-600 hover:text-orange-800 bg-transparent hover:bg-yellow-100 border border-yellow-300 hover:border-yellow-400 px-3 py-1 text-xs rounded"
                  >
                    Know More
                  </Button>
                </div>
              ))}
            </div>

            {/* Prev / Next buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handlePrev}
                disabled={page === 0}
                className="px-4 py-2 bg-[#8B0000] text-white rounded disabled:opacity-50"
              >
                ← Prev
              </button>
              <button
                onClick={handleNext}
                disabled={start + pageSize >= users.length}
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
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              Connect with {selectedUser.name}
            </h2>
            <p className="mb-4">Do you want to send a connection request?</p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Cancel
              </Button>
              <Button onClick={handleConnect} disabled={sending}>
                {sending ? "Sending..." : "Connect"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
