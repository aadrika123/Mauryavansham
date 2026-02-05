'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import { ArrowLeft, CheckCircle, XCircle, Calendar, User, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Blog {
  id: string;
  title: string;
  content: string;
  summary: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'removed';
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  imageUrl?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

interface AdminBlogDetailProps {
  blogId: string;
}

export default function AdminBlogDetail({ blogId }: AdminBlogDetailProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [userDetails, setUserDetails] = useState<{
    name: string;
    email: string;
  }>({ name: '', email: '' });
  console.log(blogId);

  useEffect(() => {
    fetchBlog();
  }, [blogId]);
  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'GET',
        credentials: 'include' // 👈 session cookies send karne ke liye
      });

      if (response.ok) {
        const data = await response.json();
        setBlog(data.blog);
        console.log(data);

        if (data?.blog?.authorId) {
          fetchUser(data.blog.authorId);
        }
      } else {
        toast.error('Failed to fetch blog details');
      }
    } catch (error) {
      toast.error('Error loading blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (userId: string) => {
    console.log('Fetching user details for profileId:', userId);
    try {
      const res = await fetch(`/api/profile/${userId}`);
      if (res.ok) {
        const userData = await res.json();
        console.log(userData?.data);
        setUserDetails(userData?.data);
      } else {
        toast.error('Failed to fetch user details');
      }
    } catch (err) {
      toast.error('Error fetching user details');
    }
  };
  console.log(blog);
  console.log(userDetails);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'approved'
        })
      });

      if (response.ok) {
        toast.success('Blog approved successfully');
        fetchBlog();
      } else {
        toast.error('Failed to approve blog');
      }
    } catch (error) {
      toast.error('Error approving blog');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'rejected',
          rejectionReason
        })
      });

      if (response.ok) {
        toast.success('Blog rejected');
        setRejectionReason('');
        setShowRejectForm(false);
        fetchBlog();
      } else {
        toast.error('Failed to reject blog');
      }
    } catch (error) {
      toast.error('Error rejecting blog');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500">Blog not found</p>
            <Link href="/admin/blogs">
              <Button variant="outline" className="mt-4 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Blog Details</h1>
        <Badge className={getStatusColor(blog.status)}>
          {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{blog.title}</CardTitle>
              <CardDescription>{blog.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{blog.content}</div>
              </div>
            </CardContent>
          </Card>
          {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} className="w-full object-fill rounded-t-lg" />}

          {blog.rejectionReason && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Previous Rejection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">{blog.rejectionReason}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blog Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{userDetails.name}</p>
                  <p className="text-sm text-gray-500">{userDetails.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-gray-500">{format(new Date(blog.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>
              </div>

              {blog.updatedAt !== blog.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(blog.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              )}

              {blog.approvedAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-green-600">Approved</p>
                    <p className="text-sm text-green-500">{format(new Date(blog.approvedAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <Link href={`/blogs/${blog.id}`}>
                <Button variant="outline" className="w-full bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Public Page
                </Button>
              </Link> */}

              {blog.status === 'pending' && (
                <div className="space-y-3">
                  <Button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Blog
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => setShowRejectForm(true)}
                    disabled={actionLoading}
                    className="w-full"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Blog
                  </Button>
                </div>
              )}

              {showRejectForm && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <Label htmlFor="rejection-reason">Rejection Reason</Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="Please provide a detailed reason for rejection..."
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleReject} disabled={actionLoading} className="flex-1">
                      Confirm Reject
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectionReason('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
