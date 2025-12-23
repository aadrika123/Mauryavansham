"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Separator } from "@/src/components/ui/separator"
// import { SubscriptionBadge } from "@/src/components/subscription-badge"
import { Crown, Calendar, CreditCard, AlertCircle, CheckCircle, ArrowRight, Download, XCircle } from "lucide-react"
import type { SubscriptionTier } from "../../../../types/subscription"
import { SubscriptionBadge } from "../../../../components/ui/subscription-badge"

interface UserSubscription {
  tier: SubscriptionTier
  status: string
  startDate: string
  endDate: string
  autoRenew: boolean
  price: number
  currency: string
  billingCycle: string
}

export default function ManageSubscriptionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in?redirect=/subscription/manage")
    }
  }, [status, router])

  useEffect(() => {
    // TODO: Fetch actual subscription data from API
    // For now, using mock data
    if (session?.user) {
      setTimeout(() => {
        setSubscription({
          tier: "premium" as SubscriptionTier,
          status: "active",
          startDate: "2024-01-15",
          endDate: "2025-01-15",
          autoRenew: true,
          price: 199,
          currency: "INR",
          billingCycle: "monthly",
        })
        setLoading(false)
      }, 500)
    }
  }, [session])

  const handleCancelSubscription = async () => {
    if (
      confirm(
        "Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.",
      )
    ) {
      // TODO: Implement cancellation API call
      alert("Subscription cancellation requested. This feature is coming soon!")
    }
  }

  const handleReactivateSubscription = async () => {
    // TODO: Implement reactivation API call
    alert("Subscription reactivation requested. This feature is coming soon!")
  }

  const handleUpdatePayment = () => {
    // TODO: Navigate to payment update page
    alert("Payment update feature coming soon!")
  }

  const handleDownloadInvoice = () => {
    // TODO: Implement invoice download
    alert("Invoice download feature coming soon!")
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading subscription details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Subscription</h2>
            <p className="text-gray-600 mb-6">You're currently on the free plan. Upgrade to unlock premium features!</p>
            <Button onClick={() => router.push("/pricing")} className="bg-orange-600 hover:bg-orange-700 text-white">
              <Crown className="w-4 h-4 mr-2" />
              View Plans
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const daysUntilRenewal = Math.ceil(
    (new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Subscription</h1>
          <p className="text-gray-600">View and manage your membership details</p>
        </div>

        {/* Current Plan Card */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-purple-50 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Plan</h2>
              <SubscriptionBadge tier={subscription.tier} size="lg" />
            </div>
            <Crown className="w-16 h-16 text-orange-600 opacity-20" />
          </div>

          <Separator className="my-4" />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  {subscription.status === "active" ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-600">Active</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-600">Cancelled</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Billing Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscription.currency === "INR" ? "₹" : "$"}
                  {subscription.price}
                  <span className="text-sm font-normal text-gray-600">/{subscription.billingCycle}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Start Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{formatDate(subscription.startDate)}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Next Billing Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{formatDate(subscription.endDate)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{daysUntilRenewal} days until renewal</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Auto-Renewal</p>
                <Badge className={subscription.autoRenew ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                  {subscription.autoRenew ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <CreditCard className="w-8 h-8 text-orange-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Update Payment Method</h3>
            <p className="text-sm text-gray-600 mb-4">Change your credit card or payment information</p>
            <Button onClick={handleUpdatePayment} variant="outline" className="w-full bg-transparent">
              Update Payment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Download className="w-8 h-8 text-orange-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Download Invoices</h3>
            <p className="text-sm text-gray-600 mb-4">Access your billing history and invoices</p>
            <Button onClick={handleDownloadInvoice} variant="outline" className="w-full bg-transparent">
              View Invoices
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>

        {/* Upgrade/Downgrade Options */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Change Your Plan</h3>
          <p className="text-gray-600 mb-4">
            Want to upgrade or downgrade? Compare our plans and make a change anytime.
          </p>
          <Button onClick={() => router.push("/pricing")} className="bg-orange-600 hover:bg-orange-700 text-white">
            View All Plans
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>

        {/* Cancel Subscription */}
        {subscription.status === "active" && (
          <Card className="p-6 border-red-200">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Subscription</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You'll continue to have access to {subscription.tier} features until{" "}
                  {formatDate(subscription.endDate)}. After that, your account will be downgraded to the free plan.
                </p>
                <Button
                  onClick={handleCancelSubscription}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </Card>
        )}

        {subscription.status === "cancelled" && (
          <Card className="p-6 bg-orange-50 border-orange-200">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Subscription Cancelled</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your subscription has been cancelled but you still have access until{" "}
                  {formatDate(subscription.endDate)}. Want to continue enjoying premium features?
                </p>
                <Button onClick={handleReactivateSubscription} className="bg-orange-600 hover:bg-orange-700 text-white">
                  Reactivate Subscription
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
