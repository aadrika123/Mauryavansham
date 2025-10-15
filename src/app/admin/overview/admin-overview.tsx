"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { FileText, Eye, Clock, CheckCircle, XCircle, Calendar, MessageSquare, Wallet2Icon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { useToast } from "@/src/components/ui/toastProvider"
import { useSession } from "next-auth/react" // ✅ to access user role

interface Stats {
  blogs: { total: number; pending: number; approved: number; rejected: number }
  ads: { total: number; pending: number; approved: number; rejected: number; active: number }
  events: { total: number; pending: number; approved: number; rejected: number }
  // businesses: { total: number; pending: number; approved: number; rejected: number }
  discussions: { total: number; pending: number; approved: number; rejected: number }
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    blogs: { total: 0, pending: 0, approved: 0, rejected: 0 },
    ads: { total: 0, pending: 0, approved: 0, rejected: 0, active: 0 },
    events: { total: 0, pending: 0, approved: 0, rejected: 0 },
    // businesses: { total: 0, pending: 0, approved: 0, rejected: 0 },
    discussions: { total: 0, pending: 0, approved: 0, rejected: 0 },
  })

  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()
  const { data: session } = useSession()
  const userRole = session?.user?.role

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [blogsRes, adsRes, eventsRes, discussionRes] = await Promise.all([
        fetch("/api/blogs"),
        fetch("/api/ads"),
        fetch("/api/events"),
        // fetch("/api/businesses"),
        fetch("/api/discussions"),
      ])

      if (blogsRes.ok && adsRes.ok && eventsRes.ok && discussionRes.ok) {
        const blogsData = await blogsRes.json()
        const adsData = await adsRes.json()
        const eventsData = await eventsRes.json()
        // const businessData = await businessRes.json()
        const discussionData = await discussionRes.json()

        setStats({
          blogs: {
            total: blogsData.blogs.length,
            pending: blogsData.blogs.filter((b: any) => b.status === "pending").length,
            approved: blogsData.blogs.filter((b: any) => b.status === "approved").length,
            rejected: blogsData.blogs.filter((b: any) => b.status === "rejected").length,
          },
          ads: {
            total: adsData.ads.length,
            pending: adsData.ads.filter((a: any) => a.status === "pending").length,
            approved: adsData.ads.filter((a: any) => a.status === "approved").length,
            rejected: adsData.ads.filter((a: any) => a.status === "rejected").length,
            active: adsData.ads.filter((a: any) => a.isActive).length,
          },
          events: {
            total: eventsData.length,
            pending: eventsData.filter((e: any) => e.status === "pending").length,
            approved: eventsData.filter((e: any) => e.status === "approved").length,
            rejected: eventsData.filter((e: any) => e.status === "rejected").length,
          },
          // businesses: {
          //   total: businessData.businesses.length,
          //   pending: businessData.businesses.filter((b: any) => b.status === "pending").length,
          //   approved: businessData.businesses.filter((b: any) => b.status === "approved").length,
          //   rejected: businessData.businesses.filter((b: any) => b.status === "rejected").length,
          // },
          discussions: {
            total: discussionData.data.length,
            pending: discussionData.data.filter((d: any) => d.status === "pending").length,
            approved: discussionData.data.filter((d: any) => d.status === "approved").length,
            rejected: discussionData.data.filter((d: any) => d.status === "rejected").length,
          },
        })

        addToast({ title: "Stats fetched successfully!", variant: "success" })
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      addToast({ title: "Error fetching stats", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // ✅ Conditionally render full stats for superAdmin only
  const showExtendedStats = userRole === "admin" || userRole === "superAdmin"

  return (
    <div className="space-y-8">
      {/* --- Summary Cards --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Pending Blogs" value={stats.blogs.pending} color="text-yellow-600" icon={<Clock className="h-4 w-4 text-yellow-600" />} />
        <SummaryCard title="Active Blogs" value={stats.blogs.approved} color="text-blue-600" icon={<Eye className="h-4 w-4 text-blue-600" />} />
        <SummaryCard title="Pending Ads" value={stats.ads.pending} color="text-yellow-600" icon={<Clock className="h-4 w-4 text-yellow-600" />} />
        <SummaryCard title="Active Ads" value={stats.ads.active} color="text-blue-600" icon={<Eye className="h-4 w-4 text-blue-600" />} />
        <SummaryCard title="Pending Events" value={stats.events.pending} color="text-yellow-600" icon={<Clock className="h-4 w-4 text-yellow-600" />} />
        <SummaryCard title="Approved Events" value={stats.events.approved} color="text-blue-600" icon={<Eye className="h-4 w-4 text-blue-600" />} />
        {/* <SummaryCard title="Total Content" value={stats.blogs.total + stats.ads.total + stats.events.total + stats.discussions.total} color="text-gray-800" icon={<FileText className="h-4 w-4 text-gray-600" />} /> */}
                <SummaryCard title="Pending Discussions" value={stats.discussions.pending} color="text-yellow-600" icon={<Clock className="h-4 w-4 text-yellow-600" />} />
        <SummaryCard title="Approved Discussions" value={stats.discussions.approved} color="text-blue-600" icon={<Eye className="h-4 w-4 text-blue-600" />} />

      </div>

      {/* --- Blog & Ads Stats --- */}
      <div className="grid gap-6 md:grid-cols-2">
        <DetailedCard
          title="Blog Statistics"
          icon={<FileText className="h-5 w-5" />}
          data={stats.blogs}
          link="/admin/blogs"
          description="Overview of blog submissions and approvals"
        />
        <DetailedCard
          title="Ad Statistics"
          icon={<Eye className="h-5 w-5" />}
          data={stats.ads}
          link="/admin/ads"
          description="Overview of advertisement submissions and status"
        />
      </div>

      {/* --- Only for superAdmin --- */}
      {showExtendedStats && (
        <div className="grid gap-6 md:grid-cols-2">
          <DetailedCard
            title="Event Statistics"
            icon={<Calendar className="h-5 w-5" />}
            data={stats.events}
            link="/admin/event-modaration"
            description="Overview of event submissions and approvals"
          />
          {/* <DetailedCard
            title="Registered Business Statistics"
            icon={<Wallet2Icon className="h-5 w-5" />}
            data={stats.businesses}
            link="/admin/register-business"
            description="Overview of business registrations and approvals"
          /> */}
          <DetailedCard
            title="Discussion Statistics"
            icon={<MessageSquare className="h-5 w-5" />}
            data={stats.discussions}
            link="/admin/discussions"
            description="Overview of discussions and moderation status"
          />
        </div>
      )}
    </div>
  )
}

/* ---------------- Reusable Card Components ---------------- */

function SummaryCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: JSX.Element }) {
  return (
    <Card className="text-center">
      <CardHeader className=" space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-center">{title}</CardTitle>
        {/* {icon} */}
      </CardHeader>
      <CardContent >
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <p className="text-xs text-muted-foreground">Updated overview</p>
      </CardContent>
    </Card>
  )
}

function DetailedCard({
  title,
  description,
  icon,
  data,
  link,
}: {
  title: string
  description: string
  icon: JSX.Element
  data: any
  link: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{icon}{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Total</span>
          <Badge variant="outline">{data.total}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm flex items-center gap-2"><Clock className="h-4 w-4 text-yellow-500" />Pending</span>
          <Badge className="bg-yellow-100 text-yellow-800">{data.pending}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Approved</span>
          <Badge className="bg-green-100 text-green-800">{data.approved}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500" />Rejected</span>
          <Badge className="bg-red-100 text-red-800">{data.rejected}</Badge>
        </div>
        <Link href={link} className="block pt-2">
          <Button className="w-full bg-transparent" variant="outline">Review</Button>
        </Link>
      </CardContent>
    </Card>
  )
}
