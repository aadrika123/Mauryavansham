'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import { CheckCircle, XCircle, Calendar, User, Eye, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/src/components/ui/alert-dialog';

interface Blog {
  id: string;
  title: string;
  summary: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'removed';
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  removeReason?: string;
  removedByName?: string;
  removedBy?: {
    id: string;
    name: string;
  };
  imageUrl?: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminBlogsList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Rejection state
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState<string | null>(null);

  // Delete/Remove state
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Confirmation dialogs
  const [showApproveDialog, setShowApproveDialog] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const data = await response.json();
        // Filter out removed blogs from the main list
        setBlogs(data.blogs);
        setLoading(false);
      } else {
        toast.error('Failed to fetch blogs');
      }
    } catch (error) {
      toast.error('Error loading blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (blogId: string) => {
    setActionLoading(blogId);
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          approvedAt: new Date().toISOString(),
          rejectionReason: null // Clear any previous rejection reason
        })
      });
      if (response.ok) {
        toast.success('Blog approved successfully');
        fetchBlogs();
      } else {
        toast.error('Failed to approve blog');
      }
    } catch (error) {
      toast.error('Error approving blog');
    } finally {
      setActionLoading(null);
      setShowApproveDialog(null);
    }
  };

  const handleReject = async (blogId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setActionLoading(blogId);
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          rejectionReason: rejectionReason.trim(),
          approvedAt: null // Clear any previous approval
        })
      });
      if (response.ok) {
        toast.success('Blog rejected successfully');
        setRejectionReason('');
        setShowRejectForm(null);
        fetchBlogs();
      } else {
        toast.error('Failed to reject blog');
      }
    } catch (error) {
      toast.error('Error rejecting blog');
    } finally {
      setActionLoading(null);
    }
  };

  const openDeleteModal = (blogId: string) => {
    setDeleteBlogId(blogId);
    setDeleteReason('');
    setIsDeleteModalOpen(true);
  };

  const handleRemove = async () => {
    if (!deleteBlogId || !deleteReason.trim()) {
      toast.error('Please provide a reason for removal');
      return;
    }

    setActionLoading(deleteBlogId);
    try {
      const response = await fetch(`/api/blogs/${deleteBlogId}`, {
        method: 'DELETE', // 🔑 DELETE method use karo
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: deleteReason.trim() })
      });

      if (response.ok) {
        toast.success('Blog removed successfully');
        setBlogs(prev => prev.filter(b => b.id !== deleteBlogId));
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to remove blog');
      }
    } catch (error) {
      toast.error('Error removing blog');
    } finally {
      setActionLoading(null);
      setIsDeleteModalOpen(false);
      setDeleteBlogId(null);
      setDeleteReason('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'removed':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-3 w-3" />;
      case 'rejected':
        return <XCircle className="h-3 w-3" />;
      case 'pending':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const filterBlogs = (status: string) => {
    if (status === 'all') return blogs;
    return blogs.filter(blog => blog.status === status);
  };

  const canApprove = (status: string) => status === 'pending' || status === 'rejected';
  const canReject = (status: string) => status === 'pending' || status === 'approved';
  const canRemove = (status: string) => status !== 'removed';

  const BlogCard = ({ blog }: { blog: Blog }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
      {blog.imageUrl && (
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3">
            <Badge className={`${getStatusColor(blog.status)} flex items-center gap-1 font-medium shadow-sm`}>
              {getStatusIcon(blog.status)}
              {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
            </Badge>
          </div>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
              {blog.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm leading-relaxed">{blog.summary}</CardDescription>
          </div>
          {!blog.imageUrl && (
            <Badge className={`${getStatusColor(blog.status)} flex items-center gap-1 font-medium shrink-0`}>
              {getStatusIcon(blog.status)}
              {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Author and Date Info */}
          <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="font-medium">{blog.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(blog.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>

          {/* Additional Info */}
          {blog.approvedAt && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
              <CheckCircle className="h-4 w-4" />
              <span>Approved on {format(new Date(blog.approvedAt), 'MMM d, yyyy')}</span>
            </div>
          )}

          {/* Rejection Reason */}
          {blog.rejectionReason && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
              <p className="text-sm text-red-700">{blog.rejectionReason}</p>
            </div>
          )}
          {/* Removed Info */}
          {blog.status === 'removed' && blog.removeReason && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg space-y-1">
              <p className="text-sm font-medium text-orange-800">
                Removal Reason: <span className="font-medium">{blog.removeReason}</span>
              </p>
              {/* <p className="text-sm text-orange-700">{blog.removeReason}</p> */}
              {blog.removedBy && (
                <p className="text-sm text-orange-700">
                  Removed By: <span className="font-medium">{blog.removedByName}</span>
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {/* View Button - Always Available */}
            <Link href={`/admin/blogs/${blog.id}`} className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>

            {/* Action Buttons Row */}
            <div className="flex gap-2">
              {/* Approve Button */}
              {canApprove(blog.status) && (
                <Button
                  size="sm"
                  onClick={() => setShowApproveDialog(blog.id)}
                  disabled={actionLoading === blog.id}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              )}

              {/* Reject Button */}
              {canReject(blog.status) && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowRejectForm(blog.id)}
                  disabled={actionLoading === blog.id}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              )}

              {/* Remove Button */}
              {canRemove(blog.status) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openDeleteModal(blog.id)}
                  disabled={actionLoading === blog.id}
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>

          {/* Rejection Form */}
          {showRejectForm === blog.id && (
            <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <Label htmlFor="rejection-reason" className="text-red-800 font-medium">
                Rejection Reason *
              </Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please provide a detailed reason for rejection..."
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                rows={3}
                className="border-red-200 focus:border-red-300"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(blog.id)}
                  disabled={actionLoading === blog.id || !rejectionReason.trim()}
                >
                  {actionLoading === blog.id ? 'Rejecting...' : 'Confirm Reject'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowRejectForm(null);
                    setRejectionReason('');
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
  );

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-8 bg-gray-200 rounded mt-4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="pending" className="relative">
            Pending
            {filterBlogs('pending').length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {filterBlogs('pending').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="relative">
            Approved
            {filterBlogs('approved').length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {filterBlogs('approved').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected" className="relative">
            Rejected
            {filterBlogs('rejected').length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {filterBlogs('rejected').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="removed" className="relative">
            Removed
            {filterBlogs('removed').length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                {filterBlogs('removed').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all" className="relative">
            All
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
              {blogs.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {['pending', 'approved', 'rejected', 'removed', 'all'].map(tabValue => (
          <TabsContent key={tabValue} value={tabValue}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filterBlogs(tabValue).map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
            {filterBlogs(tabValue).length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No {tabValue === 'all' ? '' : tabValue} blogs found</p>
                    <p className="text-sm text-gray-400">
                      {tabValue === 'pending' && 'All blogs have been reviewed'}
                      {tabValue === 'approved' && 'No approved blogs yet'}
                      {tabValue === 'rejected' && 'No rejected blogs yet'}
                      {tabValue === 'removed' && 'No removed blogs yet'}
                      {tabValue === 'all' && 'No blogs available'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Approval Confirmation Dialog */}
      <AlertDialog open={!!showApproveDialog} onOpenChange={() => setShowApproveDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Blog</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this blog? It will be published and visible to users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => showApproveDialog && handleApprove(showApproveDialog)}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve Blog
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Blog Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Remove Blog
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Please provide a reason for removing this blog. This action will hide the blog from all users.
            </p>
            <div className="space-y-2">
              <Label htmlFor="remove-reason" className="font-medium">
                Removal Reason *
              </Label>
              <Textarea
                id="remove-reason"
                value={deleteReason}
                onChange={e => setDeleteReason(e.target.value)}
                placeholder="Enter detailed reason for removal..."
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={!deleteReason.trim() || actionLoading === deleteBlogId}
            >
              {actionLoading === deleteBlogId ? 'Removing...' : 'Remove Blog'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
