"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";
import { Input } from "@/src/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

type Discussion = {
  id: number;
  title: string;
  content: string;
  category: string;
  location: string;
  authorName: string;
  createdAt: string;
  status: "pending" | "approved" | "rejected";
  likeCount: string;
  rejectedBy?: string | null;
  rejectedReason?: string | null;
  approvedBy?: string | null;
};

export default function AdminDiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [reason, setReason] = useState("");

  // Search & Filter
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // ✅ Fetch discussions
  const fetchDiscussions = async () => {
    setLoading(true);
    const res = await fetch("/api/discussions/all", { cache: "no-store" });
    const data = await res.json();
    setDiscussions(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  // ✅ Approve
  const approveDiscussion = async (id: number) => {
    await fetch(`/api/discussions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    fetchDiscussions();
  };

  // ✅ Reject with reason
  const submitRejection = async () => {
    if (!selectedId) return;

    await fetch(`/api/discussions/${selectedId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "rejected",
        rejectedReason: reason,
      }),
    });

    setOpen(false);
    setReason("");
    setSelectedId(null);
    fetchDiscussions();
  };

  // ✅ Filter & Search logic
  const filterData = (status: string) =>
    discussions
      .filter((d) => d.status === status)
      .filter((d) =>
        filterCategory === "all" ? true : d.category === filterCategory
      )
      .filter(
        (d) =>
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.content.toLowerCase().includes(search.toLowerCase()) ||
          d.authorName.toLowerCase().includes(search.toLowerCase())
      );

  if (loading) return <p className="p-6">Loading...</p>;

  // Unique categories for filter
  const categories = Array.from(new Set(discussions.map((d) => d.category)));

  return (
    <div className="p-6 space-y-6">
      {/* 🔎 Search + Filter */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by title, content, or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2"
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs for Active & Rejected */}
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Active ({filterData("approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({filterData("rejected").length})
          </TabsTrigger>
        </TabsList>

        {/* ✅ Active Discussions Table */}
        <TabsContent value="active">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Content</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Location</th>
                  <th className="p-2 border">Author</th>
                  <th className="p-2 border">Created At</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterData("approved").map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{d.title}</td>
                    <td className="p-2 border">{d.content}</td>
                    <td className="p-2 border">{d.category}</td>
                    <td className="p-2 border">{d.location}</td>
                    <td className="p-2 border">{d.authorName}</td>
                    <td className="p-2 border">
                      {new Date(d.createdAt).toLocaleString()}
                    </td>
                    <td className="p-2 border">
                      <Button
                        onClick={() => {
                          setSelectedId(d.id);
                          setOpen(true);
                        }}
                        className="bg-red-600"
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
                {filterData("approved").length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-gray-500 border"
                    >
                      No active discussions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ❌ Rejected Discussions Table */}
        <TabsContent value="rejected">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Content</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Location</th>
                  <th className="p-2 border">Author</th>
                  <th className="p-2 border">Rejected Reason</th>
                  <th className="p-2 border">Rejected By</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterData("rejected").map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{d.title}</td>
                    <td className="p-2 border">{d.content}</td>
                    <td className="p-2 border">{d.category}</td>
                    <td className="p-2 border">{d.location}</td>
                    <td className="p-2 border">{d.authorName}</td>
                    <td className="p-2 border">
                      {d.rejectedReason || "No reason"}
                    </td>
                    <td className="p-2 border">{d.rejectedBy || "Unknown"}</td>
                    <td className="p-2 border">
                      <Button
                        onClick={() => approveDiscussion(d.id)}
                        className="bg-green-600"
                      >
                        Approve
                      </Button>
                    </td>
                  </tr>
                ))}
                {filterData("rejected").length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="p-4 text-center text-gray-500 border"
                    >
                      No rejected discussions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* ✅ Reject Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Discussion</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter reason for rejection..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={submitRejection} className="bg-red-600">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
