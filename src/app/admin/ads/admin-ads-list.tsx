'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import { CheckCircle, XCircle, Calendar, User, Eye, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useToast } from '@/src/components/ui/toastProvider';
import { useSession } from 'next-auth/react';

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
  placementId: number;
  approvedBy?: string;
  rejectedBy?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AdminAdsList() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState<string | null>(null);
  const { data: session } = useSession();
  const adminName = session?.user?.name || 'Admin';

  const { addToast } = useToast();
  console.log(session?.user?.name);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads');
      if (response.ok) {
        const data = await response.json();
        addToast({
          title: 'Ads list fetched successfully!',
          variant: 'success'
        });
        setAds(data.ads);
        setLoading(false);
      } else {
        // toast.error("Failed to fetch ads")
        addToast({
          title: 'Failed to fetch ads list',
          variant: 'destructive'
        });
      }
    } catch (error) {
      // toast.error("Error loading ads")
      addToast({
        title: 'Error loading ads list',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (adId: string) => {
    if (!adminName) return toast.error('Session expired');

    setActionLoading(adId);
    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'approved',
          approvedBy: adminName // <-- add admin name here
        })
      });

      if (response.ok) {
        toast.success('Ad approved successfully');
        fetchAds();
      } else {
        toast.error('Failed to approve ad');
      }
    } catch (error) {
      toast.error('Error approving ad');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (adId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    if (!adminName) return toast.error('Session expired');

    setActionLoading(adId);
    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'rejected',
          rejectionReason,
          rejectedBy: adminName // <-- add admin name here
        })
      });

      if (response.ok) {
        toast.success('Ad rejected');
        setRejectionReason('');
        setShowRejectForm(null);
        fetchAds();
      } else {
        toast.error('Failed to reject ad');
      }
    } catch (error) {
      toast.error('Error rejecting ad');
    } finally {
      setActionLoading(null);
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

  const filterAds = (status: string) => {
    if (status === 'all') return ads;
    if (status === 'active') return ads.filter(ad => ad.isActive);
    return ads.filter(ad => ad.status === status);
  };

  const AdCard = ({ ad }: { ad: Ad }) => (
    <Card key={ad.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="relative h-32 w-full mb-3 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={ad.bannerImageUrl || '/placeholder.svg'}
            alt={ad.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{ad.title}</CardTitle>
            <CardDescription className="mt-1">
              {format(new Date(ad.fromDate), 'MMM d')} - {format(new Date(ad.toDate), 'MMM d, yyyy')}
            </CardDescription>
            <div className="flex items-center gap-1">
              <p className="text-sm text-gray-600">Placement ID :</p>
              <span className="text-sm text-gray-600">{ad.placementId}</span>
            </div>
          </div>

          <Badge className={getStatusColor(ad.status, ad.isActive, ad.isExpired)}>
            {getStatusText(ad.status, ad.isActive, ad.isExpired)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{ad.user.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(ad.createdAt), 'MMM d, yyyy')}</span>
            </div>
          </div>

          {ad.isActive && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{ad.daysLeft} days remaining</span>
            </div>
          )}

          {/* Show rejection reason if rejected */}
          {ad.status === 'rejected' && ad.rejectionReason && (
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
              <p className="text-sm text-red-700">{ad.rejectionReason}</p>
              {ad.rejectedBy && <p className="text-sm text-red-700 mt-1">Rejected By: {ad.rejectedBy}</p>}
            </div>
          )}

          {/* Show approvedBy if approved */}
          {ad.status === 'approved' && ad.approvedBy && (
            <div className="p-2 bg-green-50 rounded-lg text-sm text-green-700">Approved By: {ad.approvedBy}</div>
          )}

          <div className="flex gap-2">
            <Link href={`/admin/ads/${ad.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>

            {ad.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleApprove(ad.id)}
                  disabled={actionLoading === ad.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowRejectForm(ad.id)}
                  disabled={actionLoading === ad.id}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
          </div>

          {showRejectForm === ad.id && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(ad.id)}
                  disabled={actionLoading === ad.id}
                >
                  Confirm Reject
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
            <CardHeader>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
    );
  }

  return (
    <Tabs defaultValue="pending" className="space-y-6">
      <TabsList>
        <TabsTrigger value="pending">Pending ({filterAds('pending').length})</TabsTrigger>
        <TabsTrigger value="active">Active ({filterAds('active').length})</TabsTrigger>
        <TabsTrigger value="approved">Approved ({filterAds('approved').length})</TabsTrigger>
        <TabsTrigger value="rejected">Rejected ({filterAds('rejected').length})</TabsTrigger>
        <TabsTrigger value="all">All ({ads.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filterAds('pending').map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
        {filterAds('pending').length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500">No pending ads to review</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="active">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filterAds('active').map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="approved">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filterAds('approved').map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="rejected">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filterAds('rejected').map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="all">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ads.map(ad => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
