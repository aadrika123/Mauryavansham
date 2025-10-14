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
// import toast from "react-hot-toast";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "@/src/components/ui/use-toast";
import { toast } from "@/src/components/ui/use-toast";

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
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // Example: mapping placementId => booked dates
  const [placementBookedDates, setPlacementBookedDates] = useState<
    Record<number, Date[]>
  >({});
  console.log(placementBookedDates);

  // const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    bannerImageUrl: "",
    adUrl: "",
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
      .catch(() =>
        // toast.error("Failed to load placements"));
        toast({
          title: "Failed to load placements",
          variant: "destructive",
        })
      );
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
        setPlacementBookedDates((prev) => ({
          ...prev,
          [formData.placementId]: dates,
        }));
      })
      .catch(() =>
        //  toast.error("Failed to load booked dates"));
        toast({
          title: "Failed to load booked dates",
          variant: "destructive",
        })
      );
  }, [formData.placementId]);

  // Handle Image Upload
  // Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // alert("handleImageUpload");
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Allow both images and GIFs
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return toast({
        title: "Invalid File",
        description: "Please select a valid image (JPG, PNG, WEBP, or GIF).",
        variant: "destructive",
      });
    }

    // ✅ Max size: 5MB
    if (file.size > 10 * 1024 * 1024) {
      return toast({
        title: "File Too Large",
        description: "Please select a file smaller than 5MB.",
        variant: "destructive",
      });
    }

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
        toast({
          title: "Image uploaded successfully",
        });
      } else {
        const error = await response.json();
        toast({
          title: error.error || "Upload failed",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error uploading image",
        variant: "destructive",
      });
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
      // return toast.error("Please fill in all fields");
      return console.log("error");
    }

    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // if (from < today) return toast.error("Start date cannot be in the past");
    if (from < today) return console.log("Start date cannot be in the past");
    if (to <= from) return console.log("End date must be after start date");

    setLoading(true);
    try {
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // toast.success("Ad submitted for approval");
        toast({
          title: "Invalid File",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
        router.push("/admin/book-ads");
      } else {
        const error = await response.json();
        // toast.error(error.error || "Failed to submit ad");
        toast({
          title: error.error || "Failed to submit ad",
          variant: "destructive",
        });
      }
    } catch {
      // toast.error("Error submitting ad");
      toast({
        title: "Error submitting ad",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  // replace your existing formatDate with this
  // string => Date
  const parseDate = (str: string): Date | null => {
    if (!str) return null;
    const [day, month, year] = str.split("-").map(Number);
    return new Date(year, month - 1, day); // JS Date expects YYYY, MM-1, DD
  };

  // Date => string (DD-MM-YYYY)
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // add days
  const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };
  // Check if a date is booked
  const isBooked = (date: Date) => {
    return bookedDates.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/book-ads">
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
                onChange={(e) => {
                  const placementId = Number(e.target.value);
                  setFormData({ ...formData, placementId });
                  if (placementId) setShowCalendarPopup(true); // open modal
                }}
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
            {/* Ad URL */}
            <div className="space-y-2">
              <Label htmlFor="adUrl">Ad URL</Label>
              <Input
                id="adUrl"
                type="url"
                placeholder="https://example.com"
                value={formData.adUrl}
                onChange={(e) =>
                  setFormData({ ...formData, adUrl: e.target.value })
                }
              />
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
                      <img
                        src={imagePreview}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
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
                        PNG, JPG, or GIF up to 8MB <br />
                        (350x500px) for vertical image ads <br />
                        (900x300px) for horizontal image ads
                      </span>
                      <input
                        id="banner-upload"
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/png,image/webp,image/gif"
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
                  selected={parseDate(formData.fromDate)}
                  onChange={(date) =>
                    setFormData({
                      ...formData,
                      fromDate: date ? formatDate(date) : "",
                    })
                  }
                  excludeDates={bookedDates}
                  minDate={addDays(new Date(), 1)}
                  dateFormat="dd-MM-yyyy"
                  className="w-full border rounded px-3 py-2"
                  placeholderText="Select start date"
                  required
                  dayClassName={(date) =>
                    isBooked(date)
                      ? "bg-red-200 text-red-700"
                      : "bg-green-200 text-green-900"
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate">End Date</Label>
                <DatePicker
                  selected={parseDate(formData.toDate)}
                  onChange={(date) =>
                    setFormData({
                      ...formData,
                      toDate: date ? formatDate(date) : "",
                    })
                  }
                  excludeDates={bookedDates}
                  minDate={
                    formData.fromDate
                      ? addDays(parseDate(formData.fromDate)!, 1)
                      : addDays(new Date(), 1)
                  }
                  dateFormat="dd-MM-yyyy"
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
      {showCalendarPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[350px]">
            <h2 className="text-lg font-semibold mb-4">Available Slots</h2>

            <DatePicker
              inline
              excludeDates={bookedDates}
              minDate={addDays(new Date(), 1)}
              dayClassName={
                (date) =>
                  bookedDates.some(
                    (d) =>
                      d.getFullYear() === date.getFullYear() &&
                      d.getMonth() === date.getMonth() &&
                      d.getDate() === date.getDate()
                  )
                    ? "bg-red-200 text-red-700" // booked
                    : "bg-green-200 text-green-900" // available
              }
            />

            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCalendarPopup(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
