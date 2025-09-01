"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Textarea } from "@/src/components/ui/textarea";

type Discussion = {
  id: number;
  title: string;
  content: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  userId: number;
  rejectedBy?: string;
  rejectedReason?: string;
};

export default function AdminDiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [reason, setReason] = useState("");

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
        // ⚡️ rejectedBy backend me session user se fill karna best h
        // yaha agar bhejna ho to frontend me bhi pass kar sakte ho
      }),
    });

    setOpen(false);
    setReason("");
    setSelectedId(null);
    fetchDiscussions();
  };

  // ✅ Filter by status
  const filterByStatus = (status: string) =>
    discussions.filter((d) => d.status === status);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({filterByStatus("pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({filterByStatus("approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({filterByStatus("rejected").length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Discussions */}
        <TabsContent value="pending">
          <div className="grid md:grid-cols-2 gap-4">
            {filterByStatus("pending").map((d) => (
              <Card key={d.id}>
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-bold">{d.title}</h2>
                  <p className="text-sm text-gray-600">{d.content}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => approveDiscussion(d.id)}
                      className="bg-green-600"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedId(d.id);
                        setOpen(true);
                      }}
                      className="bg-red-600"
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Approved Discussions */}
        <TabsContent value="approved">
          <div className="grid md:grid-cols-2 gap-4">
            {filterByStatus("approved").map((d) => (
              <Card key={d.id}>
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-bold">{d.title}</h2>
                  <p className="text-sm text-gray-600">{d.content}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedId(d.id);
                        setOpen(true);
                      }}
                      className="bg-red-600"
                    >
                      Move to Rejected
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Rejected Discussions */}
        <TabsContent value="rejected">
          <div className="grid md:grid-cols-2 gap-4">
            {filterByStatus("rejected").map((d) => (
              <Card key={d.id}>
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-bold">{d.title}</h2>
                  <p className="text-sm text-gray-600">{d.content}</p>
                  <p className="text-xs text-red-500">
                    ❌ Rejected by: {d.rejectedBy || "Unknown"} <br />
                    Reason: {d.rejectedReason || "No reason given"}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => approveDiscussion(d.id)}
                      className="bg-green-600"
                    >
                      Move to Approved
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
