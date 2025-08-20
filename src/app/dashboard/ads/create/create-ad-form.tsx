"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { ArrowLeft, Upload, Send, ImageIcon } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import Image from "next/image"

export default function CreateAdForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    bannerImageUrl: "",
    fromDate: "",
    toDate: "",
  })

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
      if (img.width !== 350 || img.height !== 500) {
        toast.error("Image dimensions must be exactly 350x500 pixels")
        URL.revokeObjectURL(objectUrl)
        return
      }

      // Upload to Cloudinary
      setUploading(true)
      try {
        const uploadFormData = new FormData()
        uploadFormData.append("file", file)

        const response = await fetch("/api/upload-ads", {
          method: "POST",
          body: uploadFormData,
        })

        if (response.ok) {
          const result = await response.json()
          setImagePreview(result.url)
          setFormData({ ...formData, bannerImageUrl: result.url })
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
    e.preventDefault()

    if (!formData.title.trim() || !formData.bannerImageUrl || !formData.fromDate || !formData.toDate) {
      toast.error("Please fill in all fields")
      return
    }

    // Validate date range
    const fromDate = new Date(formData.fromDate)
    const toDate = new Date(formData.toDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (fromDate < today) {
      toast.error("Start date cannot be in the past")
      return
    }

    if (toDate <= fromDate) {
      toast.error("End date must be after start date")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/ads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Ad application submitted for approval")
        router.push("/dashboard/ads")
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to submit ad application")
      }
    } catch (error) {
      toast.error("Error submitting ad application")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/ads">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ads
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Ad Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Ad Title</Label>
              <Input
                id="title"
                placeholder="Enter advertisement title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner">Banner Image (350x500px)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-[175px] h-[250px] border rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
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
                        setImagePreview("")
                        setFormData({ ...formData, bannerImageUrl: "" })
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="banner-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">Upload banner image</span>
                        <span className="mt-1 block text-sm text-gray-500">PNG, JPG up to 5MB (must be 350x500px)</span>
                      </label>
                      <input
                        id="banner-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </div>
                    <Button type="button" className="mt-4" disabled={uploading} asChild>
                      <label htmlFor="banner-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? "Uploading..." : "Choose File"}
                      </label>
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">Image must be exactly 350x500 pixels for optimal display</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate">Start Date</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="toDate">End Date</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                  min={formData.fromDate || new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading || uploading} className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Submit for Approval
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
