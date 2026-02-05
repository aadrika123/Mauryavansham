'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import { ArrowLeft, CheckCircle, XCircle, Calendar, User, Clock, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Ad {
  id: string;
  title: string;
  bannerImageUrl: string;
  fromDate: string;
  toDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  daysLeft: number;
  isActive: boolean;
  isExpired: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface AdminAdDetailProps {
  adId: string;
}

export default function AdminAdDetail({ adId }: AdminAdDetailProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [userDetails, setUserDetails] = useState<{ name: string; email: string }>({ name: '', email: '' });

  useEffect(() => {
    fetchAd();
  }, [adId]);

  const fetchAd = async () => {
    try {
      const response = await fetch(`/api/ads/${adId}`);
      if (response.ok) {
        const data = await response.json();
        setAd(data.ad);

        // Fetch user details only after ad is fetched
        if (data.ad.userId) {
          fetchUser(data.ad.userId);
        }
      } else {
        toast.error('Failed to fetch ad details');
      }
    } catch (error) {
      toast.error('Error loading ad');
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (profileId: string) => {
    console.log('Fetching user details for profileId:', profileId);
    try {
      const res = await fetch(`/api/users/profile/${profileId}`);
      if (res.ok) {
        const userData = await res.json();
        console.log('User Data:', userData); // ✅ actual response body
        setUserDetails(userData);
      } else {
        toast.error('Failed to fetch user details');
      }
    } catch (err) {
      toast.error('Error fetching user details');
      console.error(err);
    }
  };

  console.log(userDetails, 'userDetails');

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'approved'
        })
      });

      if (response.ok) {
        toast.success('Ad approved successfully');
        fetchAd();
      } else {
        toast.error('Failed to approve ad');
      }
    } catch (error) {
      toast.error('Error approving ad');
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
      const response = await fetch(`/api/ads/${adId}`, {
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
        toast.success('Ad rejected');
        setRejectionReason('');
        setShowRejectForm(false);
        fetchAd();
      } else {
        toast.error('Failed to reject ad');
      }
    } catch (error) {
      toast.error('Error rejecting ad');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: string, isActive: boolean, isExpired: boolean) => {
    if (isExpired) return 'bg-gray-100 text-gray-800';
    if (isActive) return 'bg-blue-100 text-blue-800';

    switch (status) {
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

  const getStatusText = (status: string, isActive: boolean, isExpired: boolean) => {
    if (isExpired) return 'Expired';
    if (isActive) return 'Active';

    switch (status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
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

  if (!ad) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500">Ad not found</p>
            <Link href="/admin/ads">
              <Button variant="outline" className="mt-4 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Ads
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
        <Link href="/admin/ads">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ads
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Ad Details</h1>
        <Badge className={getStatusColor(ad.status, ad.isActive, ad.isExpired)}>
          {getStatusText(ad.status, ad.isActive, ad.isExpired)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{ad.title}</CardTitle>
              <CardDescription>
                Campaign Period: {format(new Date(ad.fromDate), 'MMM d, yyyy')} -{' '}
                {format(new Date(ad.toDate), 'MMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={ad.bannerImageUrl || '/placeholder.svg'}
                  alt={ad.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>
            </CardContent>
          </Card>

          {ad.rejectionReason && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Previous Rejection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700">{ad.rejectionReason}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Info</CardTitle>
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
                  <p className="text-sm text-gray-500">{format(new Date(ad.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>
              </div>

              {ad.isActive && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-blue-600">Days Remaining</p>
                    <p className="text-sm text-blue-500">{ad.daysLeft} days</p>
                  </div>
                </div>
              )}

              {ad.approvedAt && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-green-600">Approved</p>
                    <p className="text-sm text-green-500">{format(new Date(ad.approvedAt), 'MMM d, yyyy')}</p>
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
              {/* <Link href={`/ads/${ad.id}`}>
                <Button variant="outline" className="w-full bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Public Page
                </Button>
              </Link> */}

              {ad.status === 'pending' && (
                <div className="space-y-3">
                  <Button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Ad
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => setShowRejectForm(true)}
                    disabled={actionLoading}
                    className="w-full"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Ad
                  </Button>
                </div>
              )}
              {ad.status === 'approved' && (
                <div className="space-y-3">
                  <Button
                    variant="destructive"
                    onClick={() => setShowRejectForm(true)}
                    disabled={actionLoading}
                    className="w-full"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Ad
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
