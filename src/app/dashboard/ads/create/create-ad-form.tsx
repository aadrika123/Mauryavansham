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
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { toast } from "@/src/components/ui/use-toast";

interface Placement {
  id: number;
  pageName: string;
  sectionName: string;
}

export default function CreateAdForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [placements, setPlacements] = useState<Placement[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    bannerImageUrl: "",
    adUrl: "",
    fromDate: "",
    toDate: "",
    placementId: null as number | null,
  });

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
        toast({
          title: "Failed to load placements",
          variant: "destructive",
        })
      );
  }, []);

  // Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return toast({
        title: "Invalid File",
        description: "Please select a valid image (JPG, PNG, WEBP, or GIF).",
        variant: "destructive",
      });
    }

    if (file.size > 10 * 1024 * 1024) {
      return toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB.",
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
    e.preventDefault();
    if (
      !formData.title ||
      !formData.bannerImageUrl ||
      !formData.fromDate ||
      !formData.toDate ||
      !formData.placementId
    ) {
      return toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }

    const from = new Date(formData.fromDate);
    const to = new Date(formData.toDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (from < today) {
      return toast({
        title: "Invalid Date",
        description: "Start date cannot be in the past",
        variant: "destructive",
      });
    }

    if (to <= from) {
      return toast({
        title: "Invalid Date Range",
        description: "End date must be after start date",
        variant: "destructive",
      });
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Ad submitted for approval",
        });
        router.push("/dashboard/ads");
      } else {
        const error = await response.json();
        toast({
          title: error.error || "Failed to submit ad",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error submitting ad",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Date utility functions
  const parseDate = (str: string): Date | null => {
    if (!str) return null;
    const [day, month, year] = str.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const addDays = (date: Date, days: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
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
                onChange={(e) => {
                  const placementId = Number(e.target.value);
                  setFormData({ ...formData, placementId });
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
              <p className="text-sm text-gray-500">
                Multiple ads can run on the same placement simultaneously
              </p>
            </div>

            {/* Ad URL */}
            <div className="space-y-2">
              <Label htmlFor="adUrl">Ad URL (Optional)</Label>
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
                        PNG, JPG, or GIF up to 10MB <br />
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
                  minDate={addDays(new Date(), 1)}
                  dateFormat="dd-MM-yyyy"
                  className="w-full border rounded px-3 py-2"
                  placeholderText="Select start date"
                  required
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
    </div>
  );
}
