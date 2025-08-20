"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Textarea } from "@/src/components/ui/textarea"
import { Label } from "@/src/components/ui/label"
import { CheckCircle, XCircle, Calendar, User, Eye } from "lucide-react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import Link from "next/link"

interface Blog {
  id: string
  title: string
  summary: string
  status: "draft" | "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
  approvedAt?: string
  rejectionReason?: string
  author: {
    id: string
    name: string
    email: string
  }
}

export default function AdminBlogsList() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectForm, setShowRejectForm] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs")
      if (response.ok) {
        const data = await response.json()
        setBlogs(data.blogs)
      } else {
        toast.error("Failed to fetch blogs")
      }
    } catch (error) {
      toast.error("Error loading blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (blogId: string) => {
    setActionLoading(blogId)
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "approved",
        }),
      })

      if (response.ok) {
        toast.success("Blog approved successfully")
        fetchBlogs()
      } else {
        toast.error("Failed to approve blog")
      }
    } catch (error) {
      toast.error("Error approving blog")
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (blogId: string) => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    setActionLoading(blogId)
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "rejected",
          rejectionReason,
        }),
      })

      if (response.ok) {
        toast.success("Blog rejected")
        setRejectionReason("")
        setShowRejectForm(null)
        fetchBlogs()
      } else {
        toast.error("Failed to reject blog")
      }
    } catch (error) {
      toast.error("Error rejecting blog")
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filterBlogs = (status: string) => {
    if (status === "all") return blogs
    return blogs.filter((blog) => blog.status === status)
  }

  const BlogCard = ({ blog }: { blog: Blog }) => (
    <Card key={blog.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{blog.title}</CardTitle>
            <CardDescription className="mt-2 line-clamp-2">{blog.summary}</CardDescription>
          </div>
          <Badge className={getStatusColor(blog.status)}>
            {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{blog.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(blog.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>

          {blog.rejectionReason && (
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm font-medium text-red-800">Previous Rejection:</p>
              <p className="text-sm text-red-700">{blog.rejectionReason}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Link href={`/admin/blogs/${blog.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>

            {blog.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleApprove(blog.id)}
                  disabled={actionLoading === blog.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowRejectForm(blog.id)}
                  disabled={actionLoading === blog.id}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
          </div>

          {showRejectForm === blog.id && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(blog.id)}
                  disabled={actionLoading === blog.id}
                >
                  Confirm Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowRejectForm(null)
                    setRejectionReason("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Tabs defaultValue="pending" className="space-y-6">
      <TabsList>
        <TabsTrigger value="pending">Pending ({filterBlogs("pending").length})</TabsTrigger>
        <TabsTrigger value="approved">Approved ({filterBlogs("approved").length})</TabsTrigger>
        <TabsTrigger value="rejected">Rejected ({filterBlogs("rejected").length})</TabsTrigger>
        <TabsTrigger value="all">All ({blogs.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filterBlogs("pending").map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
        {filterBlogs("pending").length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500">No pending blogs to review</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="approved">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filterBlogs("approved").map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="rejected">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filterBlogs("rejected").map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="all">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}
