"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { ArrowLeft, Save, Send, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

export interface Blog {
  id: number;
  title: string;
  content: string;
  summary: string;
  imageUrl?: string;
  authorId: number;
  status: "pending" | "approved" | "rejected" | "draft";
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  approvedAt: Date | null;
}

interface EditBlogFormProps {
  blog: Blog;
}

export default function EditBlogForm({ blog }: EditBlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(blog.imageUrl || "");
  const [formData, setFormData] = useState({
    title: blog.title,
    summary: blog.summary,
    content: blog.content,
    imageUrl: blog.imageUrl || "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      // Optional: Check dimensions (if required)
      // if (img.width !== 350 || img.height !== 500) {
      //   toast.error("Image dimensions must be exactly 350x500 pixels");
      //   URL.revokeObjectURL(objectUrl);
      //   return;
      // }

      setUploading(true);
      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch("/api/upload-blog", {
          method: "POST",
          body: uploadFormData,
        });

        if (response.ok) {
          const result = await response.json();
          setImagePreview(result.url);
          setFormData({ ...formData, imageUrl: result.url });
          toast.success("Image uploaded successfully");
        } else {
          const error = await response.json();
          toast.error(error.error || "Upload failed");
        }
      } catch {
        toast.error("Error uploading image");
      } finally {
        setUploading(false);
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      toast.error("Invalid image file");
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  };

  const handleSubmit = async (action: "draft" | "submit") => {
    if (!formData.title.trim() || !formData.summary.trim() || !formData.content.trim() || !formData.imageUrl) {
      toast.error("Please fill in all fields including featured image");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/blogs/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, action }),
      });

      if (response.ok) {
        toast.success(
          action === "draft" ? "Blog updated and saved as draft" : "Blog updated and submitted for approval"
        );
        router.push(`/admin/my-blogs`);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to update blog");
      }
    } catch {
      toast.error("Error updating blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/my-blogs/${blog.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Blog Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter blog title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              placeholder="Write a brief summary of your blog..."
              rows={3}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your blog content here..."
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Featured Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {imagePreview ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-[250px] h-[150px] border rounded-lg overflow-hidden">
                    <Image src={imagePreview} alt="Blog preview" fill className="object-cover" sizes="250px" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setImagePreview("");
                      setFormData({ ...formData, imageUrl: "" });
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">Upload featured image</span>
                      <span className="mt-1 block text-sm text-gray-500">PNG, JPG up to 5MB</span>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </div>
                  <Button type="button" className="mt-4" disabled={uploading} asChild>
                    <label htmlFor="image-upload" className="cursor-pointer flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      {uploading ? "Uploading..." : "Choose File"}
                    </label>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => handleSubmit("draft")}
              disabled={loading || uploading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>
            <Button
              onClick={() => handleSubmit("submit")}
              disabled={loading || uploading}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Submit for Approval
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
