"use client";

import { useState, useEffect } from "react";
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
import { ArrowLeft, Send, ImageIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Placement {
  id: number;
  pageName: string;
  sectionName: string;
}

interface BookedDate {
  start: string;
  end: string;
}

export default function CreateAdForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    bannerImageUrl: "",
    fromDate: "",
    toDate: "",
    placementId: null as number | null,
  });
  console.log(formData);
  // Fetch placements
  useEffect(() => {
    fetch("/api/ad-placements/master")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        const text = await res.text();
        return text ? JSON.parse(text) : [];
      })
      .then((data) => setPlacements(data))
      .catch(() => toast.error("Failed to load placements"));
  }, []);

  // Fetch booked dates when placementId changes
  useEffect(() => {
    if (!formData.placementId) return;

    fetch(`/api/book-dates?placementId=${formData.placementId}`)
      .then((res) => res.json())
      .then((data: BookedDate[]) => {
        const dates: Date[] = [];
        data.forEach((d) => {
          const start = new Date(d.start);
          const end = new Date(d.end);
          let current = new Date(start);
          while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        });
        setBookedDates(dates);
      })
      .catch(() => toast.error("Failed to load booked dates"));
  }, [formData.placementId]);

  // Handle Image Upload
 // Handle Image Upload
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/"))
    return toast.error("Please select an image file");
  if (file.size > 5 * 1024 * 1024)
    return toast.error("Image size should be less than 5MB");

  setUploading(true);
  try {
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    const response = await fetch("/api/upload-ads", {
      method: "POST",
      body: uploadFormData,
    });

    if (response.ok) {
      const result = await response.json();
      setImagePreview(result.url);
      setFormData({ ...formData, bannerImageUrl: result.url });
      toast.success("Image uploaded successfully");
    } else {
      const error = await response.json();
      toast.error(error.error || "Upload failed");
    }
  } catch {
    toast.error("Error uploading image");
  } finally {
    setUploading(false);
  }
};


  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    console.log(formData);
    e.preventDefault();
    if (
      !formData.title ||
      !formData.bannerImageUrl ||
      !formData.fromDate ||
      !formData.toDate ||
      !formData.placementId
    ) {
      return toast.error("Please fill in all fields");
    }

    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (from < today) return toast.error("Start date cannot be in the past");
    if (to <= from) return toast.error("End date must be after start date");

    setLoading(true);
    try {
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success("Ad submitted for approval");
        router.push("/dashboard/ads");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to submit ad");
      }
    } catch {
      toast.error("Error submitting ad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/ads">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Ads
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Ad Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Ad Title</Label>
              <Input
                id="title"
                placeholder="Enter ad title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* Placement */}
            <div className="space-y-2">
              <Label htmlFor="placement">Select Placement</Label>
              <select
                id="placement"
                value={formData.placementId || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    placementId: Number(e.target.value),
                  })
                }
                className="w-full border rounded px-3 py-2"
                required
              >
                <option value="">-- Select Placement --</option>
                {placements.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.pageName} - {p.sectionName}
                  </option>
                ))}
              </select>
            </div>

            {/* Banner Image */}
            <div className="space-y-2">
              <Label htmlFor="banner">
                Banner Image (350x500px) for vertical ads or (900x300px) for
                horizontal ads
              </Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-[175px] h-[250px] border rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Banner preview"
                        fill
                        className="object-cover"
                        sizes="175px"
                      />
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
                      className="cursor-pointer mt-4 block"
                    >
                      <span className="block text-sm font-medium text-gray-900">
                        Upload banner image
                      </span>
                      <span className="block text-sm text-gray-500">
                        PNG, JPG up to 5MB <br />
                        (350x500px) for vertical image ads <br />
                        (900x300px) for horizontal image ads
                      </span>
                      <input
                        id="banner-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate">Start Date</Label>
                <DatePicker
                  selected={
                    formData.fromDate ? new Date(formData.fromDate) : null
                  }
                  onChange={(date) =>
                    setFormData({
                      ...formData,
                      fromDate: date ? date.toISOString().split("T")[0] : "",
                    })
                  }
                  excludeDates={bookedDates}
                  minDate={new Date()}
                  className="w-full border rounded px-3 py-2"
                  placeholderText="Select start date"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate">End Date</Label>
                <DatePicker
                  selected={formData.toDate ? new Date(formData.toDate) : null}
                  onChange={(date) =>
                    setFormData({
                      ...formData,
                      toDate: date ? date.toISOString().split("T")[0] : "",
                    })
                  }
                  excludeDates={bookedDates}
                  minDate={
                    formData.fromDate ? new Date(formData.fromDate) : new Date()
                  }
                  className="w-full border rounded px-3 py-2"
                  placeholderText="Select end date"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={loading || uploading}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" /> Submit for Approval
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
