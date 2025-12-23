"use client"

import { useState } from "react"
import { Check, Crown, Star, Zap, TrendingUp } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const subscriptionPlans = [
  {
    id: "free",
    name: "Free",
    tier: "free",
    price: 0,
    currency: "INR",
    billing: "monthly",
    icon: Star,
    iconColor: "text-gray-500",
    bgGradient: "from-gray-50 to-gray-100",
    features: [
      "Basic profile creation",
      "View up to 10 profiles/day",
      "Basic family tree (up to 20 members)",
      "Access to community forums",
      "Event viewing",
      "Basic search filters",
      "Standard customer support",
    ],
    limitations: ["Limited profile views", "Ads displayed", "Basic analytics only"],
  },
  {
    id: "basic",
    name: "Basic",
    tier: "basic",
    price: 99,
    currency: "INR",
    billing: "monthly",
    icon: Zap,
    iconColor: "text-blue-600",
    bgGradient: "from-blue-50 to-blue-100",
    features: [
      "Everything in Free",
      "Unlimited profile views",
      "Advanced family tree (up to 100 members)",
      "Priority listing in search results",
      "Ad-free experience",
      "Profile verification badge",
      "Advanced search filters",
      "Email notifications",
      "Priority customer support",
    ],
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    tier: "premium",
    price: 199,
    currency: "INR",
    billing: "monthly",
    icon: Crown,
    iconColor: "text-orange-600",
    bgGradient: "from-orange-50 to-orange-100",
    features: [
      "Everything in Basic",
      "Unlimited family tree members",
      "AI-powered match recommendations",
      "Featured profile highlighting",
      "Video profile upload",
      "Analytics dashboard",
      "Direct messaging unlimited",
      "Event creation access",
      "Business directory premium listing",
      "Exclusive community badge",
      "24/7 premium support",
    ],
    popular: true,
    discount: 20,
  },
  {
    id: "elite",
    name: "Elite",
    tier: "elite",
    price: 499,
    currency: "INR",
    billing: "monthly",
    icon: TrendingUp,
    iconColor: "text-purple-600",
    bgGradient: "from-purple-50 to-purple-100",
    features: [
      "Everything in Premium",
      "Personalized matchmaking consultant",
      "Profile featured on homepage",
      "Unlimited photo & video uploads",
      "Advanced genealogy tools & DNA integration",
      "Early access to new features",
      "Custom profile URL",
      "Verified elite badge",
      "Monthly genealogy reports",
      "Priority event access",
      "Dedicated account manager",
      "API access for developers",
    ],
    popular: false,
  },
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const { data: session } = useSession()
  const router = useRouter()

  const handleSubscribe = (planId: string) => {
    if (!session) {
      router.push("/login?redirect=/pricing")
      return
    }
    // TODO: Integrate payment gateway
    alert(`Subscribing to ${planId}. Payment integration coming soon!`)
  }

  const getYearlyPrice = (monthlyPrice: number) => {
    return Math.round(monthlyPrice * 12 * 0.8) // 20% discount for yearly
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-orange-100 text-orange-800 border-orange-300">
            Special Launch Offer - Save up to 20%
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Unlock premium features and connect with your community like never before. All plans include a 7-day free
            trial.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative w-14 h-7 bg-orange-600 rounded-full transition-colors"
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  billingCycle === "yearly" ? "translate-x-7" : ""
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === "yearly" ? "text-gray-900" : "text-gray-500"}`}>
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Save 20%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {subscriptionPlans.map((plan) => {
            const Icon = plan.icon
            const displayPrice = billingCycle === "yearly" ? getYearlyPrice(plan.price) : plan.price

            return (
              <Card
                key={plan.id}
                className={`relative p-6 ${
                  plan.popular ? "border-2 border-orange-500 shadow-xl scale-105" : "border border-gray-200"
                } hover:shadow-lg transition-all bg-gradient-to-br ${plan.bgGradient}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white">
                    Most Popular
                  </Badge>
                )}

                <div className="flex flex-col h-full">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <Icon className={`w-12 h-12 mx-auto mb-3 ${plan.iconColor}`} />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {plan.currency === "INR" ? "₹" : "$"}
                        {displayPrice}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-gray-600 text-sm">/{billingCycle === "yearly" ? "year" : "month"}</span>
                      )}
                    </div>
                    {billingCycle === "yearly" && plan.price > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        ₹{Math.round(displayPrice / 12)}/month billed annually
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-6 flex-grow">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full ${
                      plan.popular
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    {plan.price === 0 ? "Get Started Free" : "Start Free Trial"}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-4 px-4 font-semibold text-gray-900">Feature</th>
                  {subscriptionPlans.map((plan) => (
                    <th key={plan.id} className="py-4 px-4 text-center font-semibold text-gray-900">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-4 px-4">Profile Views/Day</td>
                  <td className="py-4 px-4 text-center">10</td>
                  <td className="py-4 px-4 text-center">Unlimited</td>
                  <td className="py-4 px-4 text-center">Unlimited</td>
                  <td className="py-4 px-4 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Family Tree Members</td>
                  <td className="py-4 px-4 text-center">20</td>
                  <td className="py-4 px-4 text-center">100</td>
                  <td className="py-4 px-4 text-center">Unlimited</td>
                  <td className="py-4 px-4 text-center">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Ad-Free Experience</td>
                  <td className="py-4 px-4 text-center">-</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4">AI Recommendations</td>
                  <td className="py-4 px-4 text-center">-</td>
                  <td className="py-4 px-4 text-center">-</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Analytics Dashboard</td>
                  <td className="py-4 px-4 text-center">-</td>
                  <td className="py-4 px-4 text-center">-</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Dedicated Support</td>
                  <td className="py-4 px-4 text-center">-</td>
                  <td className="py-4 px-4 text-center">-</td>
                  <td className="py-4 px-4 text-center">-</td>
                  <td className="py-4 px-4 text-center">
                    <Check className="w-5 h-5 text-green-600 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-br from-orange-50 to-white rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your
                billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600 text-sm">
                All paid plans include a 7-day free trial. No credit card required for the free plan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade/downgrade my plan?</h3>
              <p className="text-gray-600 text-sm">
                Yes, you can upgrade or downgrade at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit/debit cards, UPI, net banking, and digital wallets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
