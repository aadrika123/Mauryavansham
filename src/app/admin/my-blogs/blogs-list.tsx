"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Plus, Calendar, User, AlertCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Image from "next/image";
import Loader from "@/src/components/ui/loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";

interface Blog {
  id: string;
  title: string;
  summary: string;
  status: "draft" | "pending" | "approved" | "rejected" | "removed";
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  imageUrl?: string;
  removeReason?: string;
  removedBy?: string;
  removedByName?: string;

  author: {
    id: string;
    name: string;
    email: string;
  };
}

interface BlogsListProps {
  userId: string;
}

export default function BlogsList({ userId }: BlogsListProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [userId]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blogs?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setBlogs(data.blogs);
      } else {
        toast.error("Failed to fetch blogs");
      }
    } catch (error) {
      toast.error("Error loading blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteBlogId || !deleteReason.trim()) {
      toast.error("Please provide a reason for removal");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/blogs/${deleteBlogId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: deleteReason }),
      });

      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== deleteBlogId));
        toast.success("Blog removed successfully");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to remove blog");
      }
    } catch (error) {
      toast.error("Error deleting blog");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setDeleteBlogId(null);
      setDeleteReason("");
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteBlogId(id);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "pending":
        return "Pending Approval";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6 relative">
      {loading && (
        <div className="absolute inset-0 z-[999] flex items-center justify-center bg-white/70">
          <Loader />
        </div>
      )}

      <div className="flex justify-end">
        <Link href="/admin/my-blogs/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Blog
          </Button>
        </Link>
      </div>

      {blogs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No blogs yet
                </h3>
                <p className="text-gray-600 mt-1">
                  Get started by creating your first blog post
                </p>
              </div>
              <Link href="/admin/my-blogs/create">
                <Button>Create Your First Blog</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-lg transition-shadow">
              {blog.imageUrl && (
                <div className="relative w-full h-48">
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex items-start justify-between mt-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {blog.title}
                    </CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {blog.summary}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(blog.status)}>
                    {getStatusText(blog.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created {format(new Date(blog.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>

                  {blog.rejectionReason && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Rejection Reason:
                        </p>
                        <p className="text-sm text-red-700">
                          {blog.rejectionReason}
                        </p>
                      </div>
                    </div>
                  )}
                  {blog.status === "removed" && blog.removeReason && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg space-y-1">
                      <p className="text-sm font-medium text-orange-800">
                        Removal Reason:{" "}
                        <span className="font-medium">{blog.removeReason}</span>
                      </p>
                      {/* <p className="text-sm text-orange-700">{blog.removeReason}</p> */}
                      {blog.removedBy && (
                        <p className="text-sm text-orange-700">
                          Removed By:{" "}
                          <span className="font-medium">
                            {blog.removedByName}
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/my-blogs/${blog.id}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        View Details
                      </Button>
                    </Link>

                    {(blog.status === "draft" ||
                      blog.status === "rejected") && (
                      <Link
                        href={`/admin/my-blogs/${blog.id}/edit`}
                        className="flex-1"
                      >
                        <Button size="sm" className="w-full">
                          Edit
                        </Button>
                      </Link>
                    )}

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => openDeleteModal(blog.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 🔥 Delete reason modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Blog</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>Please provide a reason for removing this blog:</p>
            <Input
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Enter reason..."
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
