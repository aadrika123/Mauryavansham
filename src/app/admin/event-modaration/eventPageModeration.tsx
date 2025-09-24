"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import Loader from "@/src/components/ui/loader";
import { useToast } from "@/src/components/ui/toastProvider";
import EventModal from "./eventModal";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";

// ⚡ Event type
interface Event {
  id: number;
  title: string;
  date: string;
  fromTime: string;
  toTime: string;
  status: "pending" | "approved" | "rejected";
  description: string;
  location: string;
  organizer: string;
  image?: string;
  isFeatured?: boolean;
  reason?: string; // rejection reason
  rejectedBy?: string; // kisne reject kiya
}

export default function EventModerationPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [approveModal, setApproveModal] = useState<null | Event>(null);
  const [rejectModal, setRejectModal] = useState<null | Event>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const { addToast } = useToast();

  // Moderator name (session se)
  const moderatorName = session?.user?.name || "Admin User";

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events/applied");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      addToast({ title: "Failed to fetch events", variant: "destructive" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Approve handler
  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/events/moderate/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved", isFeatured }),
      });
      if (res.ok) {
        addToast({ title: "Event approved", variant: "success" });
        setApproveModal(null);
        setIsFeatured(false); // reset
        fetchEvents();
      }
    } catch (err) {
      addToast({ title: "Error approving event", variant: "destructive" });
    }
  };

  // ❌ Reject handler
  const handleReject = async (id: number) => {
    try {
      const res = await fetch(`/api/events/moderate/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "rejected",
          reason: rejectionReason,
          rejectedBy: moderatorName,
        }),
      });
      if (res.ok) {
        addToast({ title: "Event rejected", variant: "success" });
        setRejectModal(null);
        setRejectionReason(""); // reset
        fetchEvents();
      }
    } catch (err) {
      addToast({ title: "Error rejecting event", variant: "destructive" });
    }
  };

  if (loading) return <Loader />;

  const filteredEvents = events.filter((e) => e.status === activeTab);

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-lg mt-4">
      <h1 className="text-2xl font-bold mb-4">Event Moderation</h1>

      {/* Tabs with counts */}
      <div className="flex gap-3 mb-4">
        {(["pending", "approved", "rejected"] as const).map((tab) => {
          const count = events.filter((e) => e.status === tab).length;
          return (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()} ({count})
            </Button>
          );
        })}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sl no.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Organizer</TableHead>
            <TableHead>Status</TableHead>
            {activeTab === "rejected" && <TableHead>Reason</TableHead>}
            {activeTab === "rejected" && <TableHead>Rejected By</TableHead>}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEvents.map((event, index) => (
            <TableRow key={event.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{event.title}</TableCell>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.organizer}</TableCell>
              <TableCell
                className={
                  event.status === "pending"
                    ? "text-yellow-600"
                    : event.status === "approved"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {event.status}
              </TableCell>

              {/* Show reason and rejectedBy in rejected tab */}
              {activeTab === "rejected" && (
                <>
                  <TableCell>{event.reason || "-"}</TableCell>
                  <TableCell>{event.rejectedBy || "-"}</TableCell>
                </>
              )}

              <TableCell className="flex gap-2">
                {/* View Button */}
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setModalOpen(true);
                  }}
                  className="p-1 rounded hover:bg-blue-100 flex items-center justify-center"
                >
                  <Eye className="text-blue-600 w-6 h-6" />
                </button>

                {/* Pending: Approve + Reject */}
                {event.status === "pending" && (
                  <>
                    <button
                      onClick={() => setApproveModal(event)}
                      className="p-1 rounded hover:bg-green-100 flex items-center justify-center"
                    >
                      <CheckCircle className="text-green-600 w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setRejectModal(event)}
                      className="p-1 rounded hover:bg-red-100 flex items-center justify-center"
                    >
                      <XCircle className="text-red-600 w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Approved: Allow Reject */}
                {event.status === "approved" && (
                  <button
                    onClick={() => setRejectModal(event)}
                    className="p-1 rounded hover:bg-red-100 flex items-center justify-center"
                  >
                    <XCircle className="text-red-600 w-6 h-6" />
                  </button>
                )}

                {/* Rejected: Allow Approve */}
                {event.status === "rejected" && (
                  <button
                    onClick={() => setApproveModal(event)}
                    className="p-1 rounded hover:bg-green-100 flex items-center justify-center"
                  >
                    <CheckCircle className="text-green-600 w-6 h-6" />
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* View Modal */}
      {modalOpen && selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setModalOpen(false)} />
      )}

      {/* Approve Modal */}
      {approveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Approve Event</h2>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              Mark as Featured
            </label>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setApproveModal(null)}>
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleApprove(approveModal.id)}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Reject Event</h2>
            <textarea
              className="w-full border rounded-md p-2 mb-4"
              rows={3}
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <p className="text-xs text-gray-500 mb-4">
              Rejected by: <span className="font-medium">{moderatorName}</span>
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRejectModal(null)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleReject(rejectModal.id)}
                disabled={!rejectionReason.trim()}
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
