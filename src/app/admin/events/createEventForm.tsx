"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Checkbox } from "@/src/components/ui/checkbox";
import { ImageIcon, Send } from "lucide-react";
// import toast from "react-hot-toast";
import Image from "next/image";
import { useToast } from "@/src/components/ui/toastProvider";
import { useSession } from "next-auth/react";

export default function CreateEventForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const { addToast } = useToast();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const today = new Date().toISOString().split("T")[0]; // 👈 min date today

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    attendees: 0,
    fromTime: "",
    toTime: "",
    maxAttendees: "",
    organizer: "",
    type: "In-Person",
    category: "",
    bannerImageUrl: "",
    isFeatured: false,
  });

  // 👇 Convert 24hr time -> 12hr AM/PM format
  const formatTimeTo12Hr = (time: string) => {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h = hour % 12 || 12;
    return `${h}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  // 👇 Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      // return toast.error("Please select an image file");
      return addToast({
        title: "Invalid File",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
    if (file.size > 5 * 1024 * 1024)
      // return toast.error("Image size should be less than 5MB");
      return addToast({
        title: "Image Size Limit Exceeded",
        description: "Image size should be less than 5MB.",
        variant: "destructive",
      });

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload-event", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const result = await response.json();
        setImagePreview(result.url);
        setFormData({ ...formData, bannerImageUrl: result.url });
        // toast.success("Image uploaded successfully");
        addToast({
          title: "Image uploaded successfully",
          variant: "success",
        });
      } else {
        const error = await response.json();
        // toast.error(error.error || "Upload failed");
        addToast({
          title: error.error || "Upload failed",
          variant: "destructive",
        });
      }
    } catch {
      // toast.error("Error uploading image");
      addToast({
        title: "Error uploading image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // 👇 Submit Event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.date) {
      // return toast.error("Please fill in all required fields");
      return addToast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
    }

    if (new Date(formData.date) < new Date(today)) {
      // return toast.error("Date cannot be in the past");
      return addToast({
        title: "Date cannot be in the past",
        variant: "destructive",
      });
    }

    if (!formData.fromTime || !formData.toTime) {
      // return toast.error("Please select event timings");
      return addToast({
        title: "Please select event timings",
        variant: "destructive",
      });
    }

    if (formData.maxAttendees < "1") {
      // return toast.error("Max attendees must be at least 1");
      return addToast({
        title: "Max attendees must be at least 1",
        variant: "destructive",
      });
    }
    if (!userId) {
      addToast({
        title: "Not logged in",
        description: "Please login to create event.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId, // 👈 new
          image: formData.bannerImageUrl,
          fromTime: formatTimeTo12Hr(formData.fromTime),
          toTime: formatTimeTo12Hr(formData.toTime),
        }),
      });

      if (response.ok) {
        // toast.success("Event created successfully!");
        addToast({
          title: "Event created successfully!",
          variant: "success",
        });
        router.push("/events");
      } else {
        const error = await response.json();
        // toast.error(error.error || "Failed to create event");
        addToast({
          title: error.error || "Failed to create event",
          variant: "destructive",
        });
      }
    } catch {
      // toast.error("Error creating event");
      addToast({
        title: "Error creating event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-4">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            {/* Title */}
            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* Organizer */}
            <div className="space-y-2">
              <Label>Organizer Name</Label>
              <Input
                value={formData.organizer}
                onChange={(e) =>
                  setFormData({ ...formData, organizer: e.target.value })
                }
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  min={today}
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>From Time</Label>
                <Input
                  type="time"
                  value={formData.fromTime || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fromTime: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>To Time</Label>
                <Input
                  type="time"
                  value={formData.toTime || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, toTime: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Venue */}
            <div className="space-y-2">
              <Label>Venue</Label>
              <Input
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>

            {/* Max Attendees */}
            <div className="space-y-2">
              <Label>Max Attendees</Label>
              <Input
                type="number"
                min={1}
                value={formData.maxAttendees}
                onChange={(e) =>
                  setFormData({ ...formData, maxAttendees: e.target.value })
                }
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label>Type</Label>
              <Input
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
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
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setImagePreview("");
                        setFormData({ ...formData, bannerImageUrl: "" });
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <label
                      htmlFor="banner-upload"
                      className="cursor-pointer mt-2 block"
                    >
                      <span className="text-sm text-gray-500">
                        Upload JPG/PNG up to 5MB
                      </span>
                      <input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        required
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading || uploading}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" /> Create Event
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
