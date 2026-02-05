'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/button';
import Image from 'next/image';
import { ImageIcon, Send } from 'lucide-react';
import { useToast } from '@/src/components/ui/toastProvider';
import Loader from '@/src/components/ui/loader';

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  fromTime: string;
  toTime: string;
  location: string;
  maxAttendees: number;
  bannerImageUrl?: string;
  status: string;
  organizer: string;
}

export default function EditEventPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const router = useRouter();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState<EventData | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/my-events/${id}`);
        const data = await res.json();

        if (data.status !== 'pending' && data.status !== 'approved') {
          addToast({
            title: 'You cannot edit this event',
            variant: 'destructive'
          });
          router.push('/admin/my-events');
          return;
        }

        setFormData({
          ...data,
          bannerImageUrl: data.image || ''
        });
        setImagePreview(data.image || '');
      } catch (err) {
        console.error(err);
        addToast({
          title: 'Failed to load event',
          variant: 'destructive'
        });
        router.push('/admin/my-events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, router, addToast]);

  // Image upload function (reuse from create form)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return addToast({
        title: 'Invalid File',
        description: 'Please select a valid image file.',
        variant: 'destructive'
      });
    }
    if (file.size > 5 * 1024 * 1024) {
      return addToast({
        title: 'Image Size Limit Exceeded',
        description: 'Image size should be less than 5MB.',
        variant: 'destructive'
      });
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload-event', {
        method: 'POST',
        body: uploadFormData
      });

      if (response.ok) {
        const result = await response.json();
        setImagePreview(result.url);
        setFormData(prev => prev && { ...prev, bannerImageUrl: result.url });
        addToast({ title: 'Image uploaded successfully', variant: 'success' });
      } else {
        const error = await response.json();
        addToast({
          title: error.error || 'Upload failed',
          variant: 'destructive'
        });
      }
    } catch {
      addToast({ title: 'Error uploading image', variant: 'destructive' });
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/events/my-events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: formData.bannerImageUrl
        })
      });

      if (res.ok) {
        addToast({ title: 'Event updated successfully!', variant: 'success' });
        router.push('/admin/my-events');
      } else {
        const error = await res.json();
        addToast({
          title: error.error || 'Failed to update event',
          variant: 'destructive'
        });
      }
    } catch (err) {
      console.error(err);
      addToast({ title: 'Error updating event', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4 bg-white rounded-lg shadow-lg mt-4">
      <h1 className="text-2xl font-bold">Edit Event</h1>

      {/* Title */}
      <div className="space-y-2">
        <Label>Event Title</Label>
        <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Organizer name</Label>
        <Input value={formData.organizer} onChange={e => setFormData({ ...formData, organizer: e.target.value })} />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>From Time</Label>
          <Input
            type="time"
            value={formData.fromTime}
            onChange={e => setFormData({ ...formData, fromTime: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>To Time</Label>
          <Input
            type="time"
            value={formData.toTime}
            onChange={e => setFormData({ ...formData, toTime: e.target.value })}
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label>Venue</Label>
        <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
      </div>

      {/* Max Attendees */}
      <div className="space-y-2">
        <Label>Max Attendees</Label>
        <Input
          type="number"
          value={formData.maxAttendees}
          onChange={e => setFormData({ ...formData, maxAttendees: Number(e.target.value) })}
        />
      </div>

      {/* Banner Image */}
      <div className="space-y-2">
        <Label>Banner Image</Label>
        <div className="border-2 border-dashed p-4 rounded-lg">
          {imagePreview ? (
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-[175px] h-[175px] border rounded overflow-hidden">
                <Image src={imagePreview} alt="Preview" fill />
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setImagePreview('');
                  setFormData({ ...formData, bannerImageUrl: '' });
                }}
              >
                Change Image
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <label htmlFor="banner-upload" className="cursor-pointer mt-2 block">
                <span className="text-sm text-gray-500">Upload JPG/PNG up to 5MB</span>
                <input
                  id="banner-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          <Send className="h-4 w-4" /> Save Changes
        </Button>
      </div>
    </div>
  );
}
