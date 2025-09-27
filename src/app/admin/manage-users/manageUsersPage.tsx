"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { useToast } from "@/src/hooks/use-toast";
import { Input } from "@/src/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import Pagination from "@/src/components/common/Pagination";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  isActive: boolean;
  status: string;
  deactivatedReason?: string;
}

export default function ManageUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reason, setReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10); // ✅ FIX: pageSize ka state

  // fetch all users
  const fetchUsers = async (page = 1, limit = pageSize) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/users?page=${page}&limit=${limit}&search=${search}&role=${roleFilter}`
      );
      const json = await res.json();

      setUsers(json.data);
      setTotalPages(json.totalPages);
      setCurrentPage(json.page);
      setTotalCount(json.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: dependencies add kiye (pageSize, search, roleFilter)
  useEffect(() => {
    fetchUsers(currentPage, pageSize);
  }, [currentPage, pageSize, search, roleFilter]);

  // update user
  const updateUser = async (
    userId: number,
    updates: Partial<{
      isActive: boolean;
      role: "user" | "admin";
      deactivationReason?: string;
    }>
  ) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/admin/update-user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (res.ok) {
        toast({
          title: "Success",
          description: json.message,
          variant: "default",
        });
        fetchUsers(currentPage, pageSize); // ✅ update ke baad wahi page reload
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
      setSelectedUser(null);
      setReason("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Input
          placeholder="Search by name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSearch("")}
            disabled={!search}
          >
            Clear
          </Button>

          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value as "all" | "user" | "admin")
            }
            className="border rounded-md px-3 py-2 text-sm w-full sm:w-auto"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg bg-yellow-50 shadow-md">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-sm font-semibold">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Phone</th>
                <th className="p-3 border-b">Role</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Deactivation Reason</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-100 text-sm">
                  <td className="p-3 border-b">{u.name}</td>
                  <td className="p-3 border-b">{u.email}</td>
                  <td className="p-3 border-b">{u.phone || "-"}</td>
                  <td className="p-3 border-b">{u.role}</td>
                  <td className="p-3 border-b">
                    {u.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="p-3 border-b">{u.deactivatedReason || "-"}</td>
                  <td className="p-3 border-b flex flex-wrap gap-2">
                    {/* Toggle Active/Inactive */}
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={u.isActive}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateUser(u.id, { isActive: true });
                          } else {
                            setSelectedUser(u);
                            setReason("");
                          }
                        }}
                        disabled={actionLoading === u.id}
                      />
                      <div
                        className={`w-11 h-6 rounded-full transition ${
                          u.isActive ? "bg-green-600" : "bg-red-600"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 mt-0.5 bg-white rounded-full transform transition ${
                            u.isActive ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </div>
                    </label>

                    {/* Role Change Button */}
                    <Button
                      className={`${
                        u.role === "user"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-orange-500 hover:bg-orange-600 text-white"
                      }`}
                      disabled={actionLoading === u.id}
                      onClick={() =>
                        updateUser(u.id, {
                          role: u.role === "user" ? "admin" : "user",
                        })
                      }
                    >
                      {actionLoading === u.id
                        ? "..."
                        : u.role === "user"
                        ? "Make Admin"
                        : "Make User"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination responsive */}
          <div className="p-3">
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
        </div>
      )}

      {/* Modal for deactivation */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Deactivate {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Please provide a reason for deactivation:
            </p>
            <Textarea
              placeholder="Enter reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={!reason.trim()}
              onClick={() => {
                if (selectedUser) {
                  updateUser(selectedUser.id, {
                    isActive: false,
                    deactivationReason: reason,
                  });
                }
              }}
            >
              Confirm Deactivation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
