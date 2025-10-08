"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Plus,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
} from "lucide-react";
import { format } from "date-fns";
// import toast from "react-hot-toast";
import { useToast } from "@/src/components/ui/use-toast";

interface Ad {
  id: string;
  title: string;
  bannerImageUrl: string;
  fromDate: string;
  toDate: string;
  status: "pending" | "approved" | "rejected" | "expired";
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  daysLeft: number;
  isActive: boolean;
  isExpired: boolean;
  viewCount: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface AdsListProps {
  userId: string;
}

export default function AdsList({ userId }: AdsListProps) {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    fetchAds();
  }, [userId]);

  const fetchAds = async () => {
    try {
      const response = await fetch(`/api/ads?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAds(data.ads);
        // toast.success("Ads fetched successfully");
        toast({
          title: "Success",
          description: "Ads fetched successfully",
          // variant: "default",
        })
      } else {
        // toast.error("Failed to fetch ads");
        toast({
          title: "Error",
          description: "Failed to fetch ads",
          variant: "destructive",
        });
      }
    } catch (error) {
      // toast.error("Error loading ads");
      toast({
        title: "Error",
        description: "Error loading ads",
        variant: "destructive",
      })
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (
    status: string,
    isActive: boolean,
    isExpired: boolean
  ) => {
    if (isExpired) return "bg-gray-100 text-gray-800";
    if (isActive) return "bg-blue-100 text-blue-800";

    switch (status) {
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

  const getStatusText = (
    status: string,
    isActive: boolean,
    isExpired: boolean
  ) => {
    if (isExpired) return "Expired";
    if (isActive) return "Active";

    switch (status) {
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

  const getDaysLeftText = (ad: Ad) => {
    if (ad.isExpired) return "Expired";
    if (ad.isActive) return `${ad.daysLeft} days left`;
    if (ad.status === "approved" && ad.daysLeft > 0)
      return `Starts in ${ad.daysLeft} days`;
    return "";
  };

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
  console.log(ads, "ads");
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link href="/admin/ads/create" target="_blank">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Apply for New Ad
          </Button>
        </Link>
      </div>

      {ads.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  No ads yet
                </h3>
                <p className="text-gray-600 mt-1">
                  Get started by applying for your first banner advertisement
                </p>
              </div>
              <Link href="/admin/ads/create">
                <Button>Apply for Your First Ad</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad) => (
            <Card key={ad.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="relative h-32 w-full mb-3 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={ad.bannerImageUrl || "/placeholder.svg"}
                    alt={ad.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">
                      {ad.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {format(new Date(ad.fromDate), "MMM d")} -{" "}
                      {format(new Date(ad.toDate), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <Badge
                    className={getStatusColor(
                      ad.status,
                      ad.isActive,
                      ad.isExpired
                    )}
                  >
                    {getStatusText(ad.status, ad.isActive, ad.isExpired)}
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
                    <Eye className="h-4 w-4" /> {ad.viewCount || 0}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Applied {format(new Date(ad.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>

                  {getDaysLeftText(ad) && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span
                        className={
                          ad.isActive
                            ? "text-blue-600 font-medium"
                            : "text-gray-600"
                        }
                      >
                        {getDaysLeftText(ad)}
                      </span>
                    </div>
                  )}

                  {ad.rejectionReason && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Rejection Reason:
                        </p>
                        <p className="text-sm text-red-700">
                          {ad.rejectionReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {ad.isActive && (
                    <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Ad is Live!
                        </p>
                        <p className="text-sm text-blue-700">
                          Your banner is currently being displayed
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Link href={`/admin/ads/${ad.id}`} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
