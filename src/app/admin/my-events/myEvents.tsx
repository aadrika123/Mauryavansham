'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Loader from '@/src/components/ui/loader';
import { Button } from '@/src/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import Link from 'next/link';
import { exportToExcel } from '@/src/utils/exportExcel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';

interface Attendee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profession?: string | null;
  designation?: string | null;
  [key: string]: any;
}

interface Event {
  id: string;
  title: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  attendees?: Attendee[];
}

export default function MyEvents() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [attendeesModalOpen, setAttendeesModalOpen] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState<Attendee[]>([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState('');

  useEffect(() => {
    if (!userId) return;

    const fetchEvents = async () => {
      try {
        const res = await fetch(`/api/events?userId=${userId}`);
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [userId]);

  const filteredEvents = events.filter(e => e.status === activeTab);

  const handleViewAttendees = (event: Event) => {
    setSelectedAttendees(event.attendees || []);
    setSelectedEventTitle(event.title);
    setAttendeesModalOpen(true);
  };

  const handleExportToExcel = async () => {
    const data = selectedAttendees.map(attendee => ({
      Name: attendee.name,
      Email: attendee.email,
      Phone: attendee.phone || '-',
      Father_Name: attendee.fatherName,
      City: attendee.city,
      Profession: attendee.profession || attendee.designation || '-'
    }));

    await exportToExcel(data, 'Attendees', `${selectedEventTitle}_attendees`);
  };

  if (loading)
    return (
      <p className="text-center mt-10">
        <Loader />
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 bg-white rounded-lg shadow-lg mt-4">
      <h1 className="text-2xl font-bold mb-6">My Events</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-4">
        {['pending', 'approved', 'rejected'].map(tab => {
          const count = events.filter(e => e.status === tab).length;
          return (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab as any)}
            >
              {tab.toUpperCase()} ({count})
            </Button>
          );
        })}
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-gray-600 mt-4">No {activeTab} events found.</p>
      ) : (
        <div className="overflow-x-auto max-w-full">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead>Sl No.</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event, index) => (
                <TableRow key={event.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell
                    className={`font-medium ${
                      event.status === 'pending'
                        ? 'text-yellow-600'
                        : event.status === 'approved'
                          ? 'text-green-600'
                          : 'text-red-600'
                    }`}
                  >
                    {event.status}
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    <Link href={`/admin/my-events/${event.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>

                    {(event.status === 'pending' || event.status === 'approved') && (
                      <Link href={`/admin/my-events/${event.id}/edit`}>
                        <Button size="sm" className="bg-yellow-500 text-white hover:bg-yellow-600">
                          Edit
                        </Button>
                      </Link>
                    )}

                    {event.status === 'approved' && (
                      <Button size="sm" onClick={() => handleViewAttendees(event)}>
                        View Attendees
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Attendees Modal */}
      {attendeesModalOpen && (
        <Dialog open={attendeesModalOpen} onOpenChange={() => setAttendeesModalOpen(false)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Attendees of "{selectedEventTitle}"</DialogTitle>
            </DialogHeader>

            <div className="mt-4 overflow-x-auto max-h-[500px]">
              <Table className="min-w-[700px]">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>Sl No.</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Father's Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Profession / Designation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedAttendees.map((attendee, index) => (
                    <TableRow key={attendee.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{attendee.name}</TableCell>
                      <TableCell>{attendee.email}</TableCell>
                      <TableCell>{attendee.phone || '-'}</TableCell>
                      <TableCell>{attendee.fatherName}</TableCell>
                      <TableCell>{attendee.city}</TableCell>
                      <TableCell>{attendee.profession || attendee.designation || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <DialogFooter className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setAttendeesModalOpen(false)}>
                Close
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleExportToExcel}>
                Export to Excel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
