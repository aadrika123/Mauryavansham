"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useSession } from "next-auth/react";
import { useToast } from "@/src/hooks/use-toast";

// shadcn/ui dialog components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: "pending" | "approved" | "rejected";
  approvals: { adminName: string; action: "approved" | "rejected" }[];
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  reason?: string;
}

export default function AdminUserApprovalPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [data, setData] = useState<{
    pending: User[];
    approved: User[];
    rejected: User[];
  }>({
    pending: [],
    approved: [],
    rejected: [],
  });

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">(
    "pending"
  );
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  // reject modal states
  const [rejectUserId, setRejectUserId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      console.log(json);
      setData(json);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
        toast({
          title: "User Approved ✅",
          description: json.message,
        });
        fetchUsers();
      } else {
        toast({
          title: "Error",
          description: json.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("approve error:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // open reject modal
  const openRejectModal = (userId: number) => {
    setRejectUserId(userId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  // submit rejection with reason
  const submitReject = async () => {
    if (!session?.user || !rejectUserId) return;
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
        fetchUsers();
      } else {
        toast({
          title: "Error",
          description: json.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("reject error:", err);
    } finally {
      setActionLoading(null);
      setShowRejectModal(false);
      setRejectUserId(null);
    }
  };

  const users = data[tab].filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search))
  );

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-2">
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
            {t.charAt(0).toUpperCase() + t.slice(1)} ({data[t].length})
          </button>
        ))}
      </div>

      {/* Search */}
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

      {/* Table */}
      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No {tab} users found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Phone</th>
                <th className="p-3 border-b">Approvals</th>
                <th className="p-3 border-b">Rejections</th>
                <th className="p-3 border-b">Actions</th>
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
                            title={`${a.adminName} already ${a.action} this user`}
                          >
                            {a.adminName} ({a.action})
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">No approvals yet</span>
                      )}
                    </td>

                    <td className="p-3 border-b">
                      {u.rejectionReason ? (
                        <span
                          className="inline-block px-2 py-1 rounded text-sm font-medium bg-red-100 text-red-800"
                          title={u.rejectionReason}
                        >
                          {u.rejectionReason}
                        </span>
                      ) : (
                        <span className="text-gray-500">No rejections</span>
                      )}
                    </td>

                    <td className="p-3 border-b">
                      <div className="flex gap-2">
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
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject User</DialogTitle>
          </DialogHeader>
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
    </div>
  );
}
