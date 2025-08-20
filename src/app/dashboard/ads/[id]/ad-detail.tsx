"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { ArrowLeft, Calendar, User, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { format } from "date-fns"

interface Ad {
  id: string
  title: string
  bannerImageUrl: string
  fromDate: string
  toDate: string
  status: "pending" | "approved" | "rejected" | "expired"
  createdAt: string
  updatedAt: string
  approvedAt?: string
  rejectionReason?: string
  user: {
    id: string
    name: string
    email: string
  }
}

interface AdDetailProps {
  ad: Ad
  currentUserId: string
  userRole?: string
}

export default function AdDetail({ ad, currentUserId, userRole }: AdDetailProps) {
  const today = new Date()
  const fromDate = new Date(ad.fromDate)
  const toDate = new Date(ad.toDate)

  let daysLeft = 0
  let isActive = false
  let isExpired = false

  if (ad.status === "approved") {
    if (today < fromDate) {
      // Ad hasn't started yet
      daysLeft = Math.ceil((fromDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    } else if (today >= fromDate && today <= toDate) {
      // Ad is currently active
      isActive = true
      daysLeft = Math.ceil((toDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    } else {
      // Ad has expired
      isExpired = true
      daysLeft = 0
    }
  }

  const getStatusColor = (status: string) => {
    if (isExpired) return "bg-gray-100 text-gray-800"
    if (isActive) return "bg-blue-100 text-blue-800"

    switch (status) {
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

  const getStatusText = (status: string) => {
    if (isExpired) return "Expired"
    if (isActive) return "Active"

    switch (status) {
      case "pending":
        return "Pending Approval"
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
      default:
        return status
    }
  }

  const getDaysLeftText = () => {
    if (isExpired) return "Ad has expired"
    if (isActive) return `${daysLeft} days remaining`
    if (ad.status === "approved" && daysLeft > 0) return `Starts in ${daysLeft} days`
    return ""
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/ads">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ads
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{ad.title}</CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{ad.user.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Applied {format(new Date(ad.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
              </div>
            </div>
            <Badge className={getStatusColor(ad.status)}>{getStatusText(ad.status)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Banner Preview</h3>
            <div className="flex justify-center">
              <div className="relative w-[350px] h-[500px] border rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={ad.bannerImageUrl || "/placeholder.svg"}
                  alt={ad.title}
                  fill
                  className="object-cover"
                  sizes="350px"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Campaign Duration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Start: {format(new Date(ad.fromDate), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>End: {format(new Date(ad.toDate), "MMM d, yyyy")}</span>
                </div>
                {getDaysLeftText() && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className={isActive ? "text-blue-600 font-medium" : "text-gray-600"}>
                      {getDaysLeftText()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Ad Specifications</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Dimensions: 350x500 pixels</div>
                <div>Format: Banner Advertisement</div>
                <div>Duration: {Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))} days</div>
              </div>
            </div>
          </div>

          {ad.rejectionReason && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-red-800 mb-1">Rejection Reason</h4>
                <p className="text-red-700">{ad.rejectionReason}</p>
              </div>
            </div>
          )}

          {ad.status === "approved" && ad.approvedAt && (
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-800 mb-1">Approved</h4>
                <p className="text-green-700">
                  This ad was approved on {format(new Date(ad.approvedAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          )}

          {isActive && (
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Ad is Live!</h4>
                <p className="text-blue-700">Your banner advertisement is currently being displayed to users</p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Last updated: {format(new Date(ad.updatedAt), "MMM d, yyyy 'at' h:mm a")}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
