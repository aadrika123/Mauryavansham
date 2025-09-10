"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { FileText, Eye, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { useToast } from "@/src/components/ui/toastProvider"

interface Stats {
  blogs: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  ads: {
    total: number
    pending: number
    approved: number
    rejected: number
    active: number
  }
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    blogs: { total: 0, pending: 0, approved: 0, rejected: 0 },
    ads: { total: 0, pending: 0, approved: 0, rejected: 0, active: 0 },
  })
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast();

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [blogsResponse, adsResponse] = await Promise.all([fetch("/api/blogs"), fetch("/api/ads")])

      if (blogsResponse.ok && adsResponse.ok) {
        const blogsData = await blogsResponse.json()
        const adsData = await adsResponse.json()

        const blogStats = {
          total: blogsData.blogs.length,
          pending: blogsData.blogs.filter((b: any) => b.status === "pending").length,
          approved: blogsData.blogs.filter((b: any) => b.status === "approved").length,
          rejected: blogsData.blogs.filter((b: any) => b.status === "rejected").length,
        }

        const adStats = {
          total: adsData.ads.length,
          pending: adsData.ads.filter((a: any) => a.status === "pending").length,
          approved: adsData.ads.filter((a: any) => a.status === "approved").length,
          rejected: adsData.ads.filter((a: any) => a.status === "rejected").length,
          active: adsData.ads.filter((a: any) => a.isActive).length,
        }

        setStats({ blogs: blogStats, ads: adStats })
        addToast({
          title: "Stats fetched successfully!",
          variant: "success",

        })
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      addToast({
        title: "Error fetching stats",
        variant: "destructive",
      })
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

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Blogs</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.blogs.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Ads</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.ads.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Ads</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.ads.active}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blogs.total + stats.ads.total}</div>
            <p className="text-xs text-muted-foreground">Blogs + Ads</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Blog Statistics
            </CardTitle>
            <CardDescription>Overview of blog submissions and approvals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Blogs</span>
              <Badge variant="outline">{stats.blogs.total}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                Pending Review
              </span>
              <Badge className="bg-yellow-100 text-yellow-800">{stats.blogs.pending}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Approved
              </span>
              <Badge className="bg-green-100 text-green-800">{stats.blogs.approved}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                Rejected
              </span>
              <Badge className="bg-red-100 text-red-800">{stats.blogs.rejected}</Badge>
            </div>
            <Link href="/admin/blogs" className="block pt-2">
              <Button className="w-full bg-transparent" variant="outline">
                Review Blogs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Ad Statistics
            </CardTitle>
            <CardDescription>Overview of advertisement submissions and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Ads</span>
              <Badge variant="outline">{stats.ads.total}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                Pending Review
              </span>
              <Badge className="bg-yellow-100 text-yellow-800">{stats.ads.pending}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-500" />
                Currently Active
              </span>
              <Badge className="bg-blue-100 text-blue-800">{stats.ads.active}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Approved
              </span>
              <Badge className="bg-green-100 text-green-800">{stats.ads.approved}</Badge>
            </div>
            <Link href="/admin/ads" className="block pt-2">
              <Button className="w-full bg-transparent" variant="outline">
                Review Ads
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
