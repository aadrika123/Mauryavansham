"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useSession } from "next-auth/react";
import { useToast } from "@/src/hooks/use-toast";
import Pagination from "@/src/components/common/Pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";

interface Approval {
  adminName: string;
  action: "approved" | "rejected";
}

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: "pending" | "approved" | "rejected";
  approvals: Approval[];
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  fatherName?: string;
  city?: string;
}

type Tab = "pending" | "approved" | "rejected" | "view";

export default function AdminUserApprovalPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [data, setData] = useState<Record<Tab, User[]>>({
    pending: [],
    approved: [],
    rejected: [],
    view: [],
  });

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("pending");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // reject modal
  const [rejectUserId, setRejectUserId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  // view modal
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // pagination per tab
  const [pagination, setPagination] = useState({
    pending: { currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
    approved: { currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
    rejected: { currentPage: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
  });

  // 🔹 Fetch users per tab with pagination
  const fetchUsers = async (tab: "pending" | "approved" | "rejected") => {
    setLoading(true);
    try {
      const { currentPage, pageSize } = pagination[tab];
      const res = await fetch(
        `/api/admin/users?tab=${tab}&page=${currentPage}&pageSize=${pageSize}`
      );
      const json = await res.json();

      setData((prev) => ({ ...prev, [tab]: json.users }));
      setPagination((prev) => ({
        ...prev,
        [tab]: {
          ...prev[tab],
          totalItems: json.totalItems,
          totalPages: json.totalPages,
        },
      }));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (tab !== "view") fetchUsers(tab);
}, [tab, pagination[tab as "pending" | "approved" | "rejected"].currentPage, 
    pagination[tab as "pending" | "approved" | "rejected"].pageSize]);


  // 🔹 Approve user
  const handleApprove = async (userId: number) => {
    if (!session?.user) return;
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/approve-user/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: session.user.id,
          adminName: session.user.name,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        toast({ title: "User Approved ✅", description: json.message });
        if (tab !== "view") fetchUsers(tab);
      } else {
        toast({
          title: "Error",
          description: json.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // 🔹 Reject user
  const openRejectModal = (userId: number) => {
    setRejectUserId(userId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const submitReject = async () => {
    if (!session?.user || rejectUserId === null) return;
    setActionLoading(rejectUserId);
    try {
      const res = await fetch(`/api/admin/reject-user/${rejectUserId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: session.user.id,
          adminName: session.user.name,
          reason: rejectReason,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        toast({
          title: "User Rejected ❌",
          description: json.message,
          variant: "destructive",
        });
        // fetchUsers(tab);
        if (tab !== "view") fetchUsers(tab);
      } else {
        toast({
          title: "Error",
          description: json.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
      setShowRejectModal(false);
      setRejectUserId(null);
    }
  };
  useEffect(() => {
    // First load: fetch all 3 tabs
    const fetchAllTabs = async () => {
      setLoading(true);
      try {
        const tabs: ("pending" | "approved" | "rejected")[] = [
          "pending",
          "approved",
          "rejected",
        ];
        const allData: Partial<
          Record<"pending" | "approved" | "rejected", User[]>
        > = {};

        await Promise.all(
          tabs.map(async (t) => {
            const { currentPage, pageSize } = pagination[t];
            const res = await fetch(
              `/api/admin/users?tab=${t}&page=${currentPage}&pageSize=${pageSize}`
            );
            const json = await res.json();
            allData[t] = json.users;

            setPagination((prev) => ({
              ...prev,
              [t]: {
                ...prev[t],
                totalItems: json.totalItems,
                totalPages: json.totalPages,
              },
            }));
          })
        );

        setData((prev) => ({ ...prev, ...allData }));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTabs();
  }, []);

  // 🔹 Filter users for search
  const users =
    tab === "view"
      ? [...data.pending, ...data.approved, ...data.rejected]
      : data[tab].filter(
          (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            (u.phone && u.phone.includes(search))
        );

  const rejectUser = users.find((u) => u.id === rejectUserId);

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-4">
      {/* Tabs */}
      <div className="flex space-x-3 border-b pb-2">
        {(["pending", "approved", "rejected"] as const).map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-t-lg font-medium ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {data[t].length > 0 && ` (${data[t].length})`}
          </button>
        ))}
      </div>

      {/* Search */}
      {tab !== "view" && (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2"
          />
          <Button
            variant="outline"
            onClick={() => setSearch("")}
            disabled={!search}
          >
            Clear
          </Button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No {tab} users found.</p>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-semibold">
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Phone</th>
                  <th className="p-3 border-b">Approvals</th>
                  {tab === "rejected" && (
                    <th className="p-3 border-b">Reasons</th>
                  )}
                  <th className="p-3 border-b">Actions</th>
                  <th className="p-3 border-b">View</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const currentAdminAction = u.approvals.find(
                    (a) => a.adminName === session?.user?.name
                  );

                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{u.name}</td>
                      <td className="p-3 border-b">{u.email}</td>
                      <td className="p-3 border-b">{u.phone || "-"}</td>
                      <td className="p-3 border-b">
                        {u.approvals?.length ? (
                          u.approvals.map((a, idx) => (
                            <span
                              key={idx}
                              className={`inline-block px-2 py-1 rounded text-sm font-medium mr-1 ${
                                a.action === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                              title={`${a.adminName} ${a.action} this user`}
                            >
                              {a.adminName} ({a.action})
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">
                            No approvals yet
                          </span>
                        )}
                      </td>
                      {tab === "rejected" && (
                        <td className="p-3 border-b">
                          {u.rejectionReason || "-"}
                        </td>
                      )}
                      <td className="p-3 border-b flex gap-2">
                        {(tab === "pending" || tab === "rejected") && (
                          <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            disabled={
                              actionLoading === u.id ||
                              currentAdminAction?.action === "approved"
                            }
                            onClick={() => handleApprove(u.id)}
                          >
                            {actionLoading === u.id ? "..." : "Approve"}
                          </Button>
                        )}
                        {(tab === "pending" || tab === "approved") && (
                          <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={
                              actionLoading === u.id ||
                              currentAdminAction?.action === "rejected"
                            }
                            onClick={() => openRejectModal(u.id)}
                          >
                            {actionLoading === u.id ? "..." : "Reject"}
                          </Button>
                        )}
                      </td>
                      <td className="p-3 border-b">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setViewUser(u);
                            setShowViewModal(true);
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {tab !== "view" && (
            <Pagination
              currentPage={pagination[tab].currentPage}
              totalPages={pagination[tab].totalPages}
              totalItems={pagination[tab].totalItems}
              pageSize={pagination[tab].pageSize}
              onPageChange={(page) =>
                setPagination((prev) => ({
                  ...prev,
                  [tab]: { ...prev[tab], currentPage: page },
                }))
              }
              onPageSizeChange={(size) =>
                setPagination((prev) => ({
                  ...prev,
                  [tab]: { ...prev[tab], pageSize: size, currentPage: 1 },
                }))
              }
            />
          )}
        </>
      )}

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reject User {rejectUser ? `– ${rejectUser.name}` : ""}
            </DialogTitle>
          </DialogHeader>

          {rejectUser && (
            <p className="text-sm text-gray-600 mb-2">
              Are you sure you want to reject{" "}
              <span className="font-semibold">{rejectUser.name}</span>?
            </p>
          )}

          <Input
            placeholder="Enter rejection reason..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={submitReject}
              disabled={!rejectReason.trim()}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-2 text-sm">
              <p>
                <b>Name:</b> {viewUser.name}
              </p>
              <p>
                <b>Email:</b> {viewUser.email}
              </p>
              <p>
                <b>Phone:</b> {viewUser.phone || "-"}
              </p>
              <p>
                <b>Father's Name:</b> {viewUser.fatherName || "-"}
              </p>
              <p>
                <b>City:</b> {viewUser.city || "-"}
              </p>
              {viewUser.approvedAt && (
                <p>
                  <b>Approved At:</b> {viewUser.approvedAt}
                </p>
              )}
              {viewUser.rejectedAt && (
                <p>
                  <b>Rejected At:</b> {viewUser.rejectedAt}
                </p>
              )}
              {viewUser.rejectionReason && (
                <p>
                  <b>Rejection Reason:</b> {viewUser.rejectionReason}
                </p>
              )}
              <div>
                <b>Approvals:</b>{" "}
                {viewUser.approvals.length ? (
                  viewUser.approvals.map((a, idx) => (
                    <span
                      key={idx}
                      className={`inline-block px-2 py-1 rounded text-xs font-medium mr-1 ${
                        a.action === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {a.adminName} ({a.action})
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No approvals yet</span>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
