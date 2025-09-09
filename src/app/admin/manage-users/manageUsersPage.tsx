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
import { Switch } from "@/src/components/ui/switch";

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reason, setReason] = useState("");

  // fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      console.log(json);
      setUsers(json);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

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
        fetchUsers();
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

  // filtered users
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search))
  );

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Users</h1>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search by name, email, phone..."
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

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold">
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
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{u.name}</td>
                  <td className="p-3 border-b">{u.email}</td>
                  <td className="p-3 border-b">{u.phone || "-"}</td>
                  <td className="p-3 border-b">{u.role}</td>
                  <td className="p-3 border-b">
                    {u.isActive ? "Active" : `Inactive`}
                  </td>
                  <td className="p-3 border-b">{u.deactivatedReason || "-"}</td>
                  <td className="p-3 border-b flex gap-2">
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

                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
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
        </div>
      )}

      {/* Modal for deactivation */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
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
