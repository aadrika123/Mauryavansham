'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Loader from '@/src/components/ui/loader';

interface Event {
  id: string;
  title: string;
  date: string;
  status: string;
  description: string;
  location?: string;
  createdBy?: string;
  image?: string;
}

export default function EventDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/my-events/${id}`);
        const data = await res.json();
        setEvent(data);
        fetchUser(data.userId);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const fetchUser = async (userId: number) => {
    console.log('Fetching user details for profileId:', userId);
    try {
      const res = await fetch(`/api/users/profile/${userId}`);
      if (res.ok) {
        const userData = await res.json();
        console.log('User Data:', userData); // ✅ actual response body
        setUserDetails(userData);
      } else {
        console.error('Failed to fetch user details');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10">
        <Loader />
      </p>
    );
  if (!event) return <p className="text-center mt-10">Event not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 bg-white rounded-lg shadow-lg mt-4">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-semibold">Date:</span> {event.date}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Location:</span> {event.location || 'Not specified'}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Created By:</span> {userDetails?.name || 'Unknown'}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Status:</span>{' '}
          <span className={`${event.status === 'pending' ? 'text-yellow-600' : 'text-green-600'} font-medium`}>
            {event.status}
          </span>
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700">{event.description}</p>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Image</h2>
        {event.image ? (
          <img src={event.image} alt={event.title} className="max-w-full h-auto" />
        ) : (
          <p>No image available</p>
        )}
      </div>

      {/* <div className="mt-6 flex gap-3">
        <Link href="/myEvents">
          <button className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600">
            Back to My Events
          </button>
        </Link>

        {event.status === "pending" && (
          <Link href={`/admin/events/${event.id}/edit`}>
            <button className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600">
              Edit Event
            </button>
          </Link>
        )}
      </div> */}
    </div>
  );
}
