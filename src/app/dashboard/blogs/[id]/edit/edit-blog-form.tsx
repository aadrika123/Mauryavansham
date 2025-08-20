"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { ArrowLeft, Save, Send } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

interface Blog {
  id: string
  title: string
  content: string
  summary: string
  status: string
}

interface EditBlogFormProps {
  blog: Blog
}

export default function EditBlogForm({ blog }: EditBlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: blog.title,
    summary: blog.summary,
    content: blog.content,
  })

  const handleSubmit = async (action: "draft" | "submit") => {
    if (!formData.title.trim() || !formData.summary.trim() || !formData.content.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/blogs/${blog.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          action,
        }),
      })

      if (response.ok) {
        toast.success(
          action === "draft" ? "Blog updated and saved as draft" : "Blog updated and submitted for approval",
        )
        router.push(`/blogs/${blog.id}`)
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to update blog")
      }
    } catch (error) {
      toast.error("Error updating blog")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/blogs/${blog.id}`}>
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
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter blog title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

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

          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => handleSubmit("draft")}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>
            <Button onClick={() => handleSubmit("submit")} disabled={loading} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Submit for Approval
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
