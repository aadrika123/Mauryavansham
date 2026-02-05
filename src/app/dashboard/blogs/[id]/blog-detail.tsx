'use client';

import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { ArrowLeft, Calendar, User, Edit, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Blog {
  id: number;
  title: string;
  content: string;
  summary: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'removed';
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date | null;
  rejectionReason?: string | null;
  imageUrl?: string;
  author: {
    id: number;
    name: string;
    email: string;
  } | null;
}

interface BlogDetailProps {
  blog: Blog;
  currentUserId: string;
  userRole?: string;
}

export default function BlogDetail({ blog, currentUserId, userRole }: BlogDetailProps) {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'pending':
        return 'Pending Approval';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  const canEdit = blog.author?.id === Number(currentUserId) && (blog.status == 'draft' || blog.status == 'rejected');
  console.log(blog);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/blogs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Button>
        </Link>
        {canEdit && (
          <Link href={`/dashboard/blogs/${blog.id}/edit`}>
            <Button size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Blog
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{blog.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{blog.author?.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created {format(new Date(blog.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(blog.status)}>{getStatusText(blog.status)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            {blog.imageUrl && <img src={blog.imageUrl} alt={blog.title} className="w-full object-fill rounded-t-lg" />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
            <p className="text-gray-700 leading-relaxed">{blog.summary}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Content</h3>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{blog.content}</div>
            </div>
          </div>

          {blog.rejectionReason && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 mb-1">Rejection Reason</h4>
                <p className="text-red-700">{blog.rejectionReason}</p>
              </div>
            </div>
          )}

          {blog.status === 'approved' && blog.approvedAt && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-800 mb-1">Approved</h4>
                <p className="text-green-700">
                  This blog was approved on {format(new Date(blog.approvedAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Last updated: {format(new Date(blog.updatedAt), "MMM d, yyyy 'at' h:mm a")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
