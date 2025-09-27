"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { ArrowLeft, Upload, Send, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import Image from "next/image";

export default function CreateBlogForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    imageUrl: "",
  });
console.log(formData);
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    // Create image to check dimensions
    const img = new window.Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = async () => {
      // Check dimensions (350x500px)
      // if (img.width !== 350 || img.height !== 500) {
      //   toast.error("Image dimensions must be exactly 350x500 pixels")
      //   URL.revokeObjectURL(objectUrl)
      //   return
      // }

      // Upload to Cloudinary
      setUploading(true)
      try {
        const uploadFormData = new FormData()
        uploadFormData.append("file", file)

        const response = await fetch("/api/upload-blog", {
          method: "POST",
          body: uploadFormData,
        })

        if (response.ok) {
          const result = await response.json()
          setImagePreview(result.url)
          setFormData({ ...formData, imageUrl: result.url })
          toast.success("Image uploaded successfully")
        } else {
          const error = await response.json()
          toast.error(error.error || "Upload failed")
        }
      } catch (error) {
        toast.error("Error uploading image")
      } finally {
        setUploading(false)
        URL.revokeObjectURL(objectUrl)
      }
    }

    img.onerror = () => {
      toast.error("Invalid image file")
      URL.revokeObjectURL(objectUrl)
    }

    img.src = objectUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.summary || !formData.content || !formData.imageUrl) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, action: "submit" }),
      });

      if (res.ok) {
        toast.success("Blog submitted successfully");
        router.push("/admin/my-blogs");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to submit blog");
      }
    } catch {
      toast.error("Error submitting blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/my-blogs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Blog Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Blog Title</Label>
              <Input
                id="title"
                placeholder="Enter blog title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                placeholder="Write a brief summary..."
                rows={3}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your blog content..."
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>

            {/* Image Upload */}
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

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading || uploading} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Submit Blog
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
