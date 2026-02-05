'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  Award,
  Activity,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { Button } from '@/src/components/ui/button';
import type { JSX } from 'react/jsx-runtime'; // Import JSX to fix the undeclared variable error

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!session?.user?.id) return;

      setLoading(true);
      try {
        const days = timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : timeRange === '90d' ? '90' : '365';

        const [
          overviewRes,
          engagementRes,
          topContentRes,
          familyTreeRes,
          communityRes,
          eventsDetailRes,
          engagementDetailRes
        ] = await Promise.all([
          fetch(`/api/analytics/overview?period=${days}`),
          fetch(`/api/analytics/engagement?days=${days}`),
          fetch(`/api/analytics/top-content`),
          fetch(`/api/analytics/family-tree`),
          fetch(`/api/analytics/community`),
          fetch(`/api/analytics/events-detail`),
          fetch(`/api/analytics/engagement-detail`)
        ]);

        const overview = await overviewRes.json();
        const engagement = await engagementRes.json();
        const topContent = await topContentRes.json();
        const familyTree = await familyTreeRes.json();
        const community = await communityRes.json();
        const eventsDetail = await eventsDetailRes.json();
        const engagementDetail = await engagementDetailRes.json();

        setAnalyticsData({
          profileViews: {
            total: overview.overview?.profileViews || 0,
            trend: 12.5, // Can be calculated from historical data
            comparison: 'vs last month'
          },
          engagement: {
            total: engagementDetail.engagement?.total || 0,
            trend: 8.3, // Can be calculated from historical data
            comparison: 'vs last month',
            breakdown: engagementDetail.engagement?.breakdown || {
              likes: 0,
              comments: 0,
              shares: 0,
              messages: 0
            }
          },
          familyTree: familyTree.familyTree || {
            totalMembers: 0,
            newThisMonth: 0,
            completeness: 0,
            generations: 1
          },
          events: eventsDetail.events || {
            attended: 0,
            created: 0,
            upcoming: 0,
            invitations: 0
          },
          community: community.community || {
            connections: 0,
            newConnections: 0,
            profileRank: 0,
            totalUsers: 0
          },
          content: {
            posts: overview.overview?.totalDiscussions || 0,
            blogs: overview.overview?.totalBlogs || 0,
            comments: engagementDetail.engagement?.breakdown?.comments || 0,
            reactions: overview.overview?.blogViews || 0
          },
          isPremium: overview.user?.isPremium || false,
          isVerified: overview.user?.isVerified || false,
          topContent: topContent.topContent || { blogs: [], events: [], discussions: [] },
          recentActivity: engagement.engagement || {}
        });
      } catch (error) {
        console.error('[v0] Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [session, timeRange]);

  if (loading || !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const topPerformingContent = [
    ...analyticsData.topContent.blogs.map((blog: any) => ({
      title: blog.title,
      type: 'Blog',
      views: blog.views || 0,
      engagement: 0,
      date: new Date(blog.createdAt).toLocaleDateString()
    })),
    ...analyticsData.topContent.events.map((event: any) => ({
      title: event.title,
      type: 'Event',
      views: event.maxAttendees || 0,
      engagement: 0,
      date: new Date(event.date).toLocaleDateString()
    })),
    ...analyticsData.topContent.discussions.map((discussion: any) => ({
      title: discussion.title,
      type: 'Discussion',
      views: discussion.replyCount || 0,
      engagement: 0,
      date: new Date(discussion.createdAt).toLocaleDateString()
    }))
  ].slice(0, 5);

  const recentActivity = [
    ...(analyticsData.recentActivity.recentBlogs || []).map((blog: any) => ({
      action: 'New blog post:',
      user: blog.title,
      time: new Date(blog.createdAt).toLocaleDateString()
    })),
    ...(analyticsData.recentActivity.recentEvents || []).map((event: any) => ({
      action: 'Event created:',
      user: event.title,
      time: new Date(event.date).toLocaleDateString()
    })),
    ...(analyticsData.recentActivity.recentDiscussions || []).map((discussion: any) => ({
      action: 'Discussion started:',
      user: discussion.title,
      time: new Date(discussion.createdAt).toLocaleDateString()
    }))
  ].slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">Your Analytics</h1>
              {analyticsData.isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">Premium</Badge>
              )}
              {analyticsData.isVerified && <Badge className="bg-blue-600 text-white">Verified</Badge>}
            </div>
            <p className="text-gray-600">Track your community presence and engagement</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            {(['7d', '30d', '90d', '1y'] as const).map(range => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? 'bg-blue-600' : ''}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Profile Views"
            value={analyticsData.profileViews.total.toLocaleString()}
            trend={analyticsData.profileViews.trend}
            icon={<Eye className="w-6 h-6 text-blue-600" />}
            color="blue"
          />
          <MetricCard
            title="Engagement Rate"
            value={analyticsData.engagement.total.toLocaleString()}
            trend={analyticsData.engagement.trend}
            icon={<Heart className="w-6 h-6 text-red-600" />}
            color="red"
          />
          <MetricCard
            title="Connections"
            value={analyticsData.community.connections.toLocaleString()}
            trend={15.2}
            icon={<Users className="w-6 h-6 text-green-600" />}
            color="green"
          />
          <MetricCard
            title="Community Rank"
            value={`#${analyticsData.community.profileRank}`}
            trend={-5.4}
            icon={<Award className="w-6 h-6 text-purple-600" />}
            color="purple"
            isRank
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Engagement Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <EngagementBar
                label="Messages"
                value={analyticsData.engagement.breakdown.messages}
                total={analyticsData.engagement.total}
                color="bg-blue-600"
              />
              <EngagementBar
                label="Likes"
                value={analyticsData.engagement.breakdown.likes}
                total={analyticsData.engagement.total}
                color="bg-red-600"
              />
              <EngagementBar
                label="Comments"
                value={analyticsData.engagement.breakdown.comments}
                total={analyticsData.engagement.total}
                color="bg-green-600"
              />
              <EngagementBar
                label="Shares"
                value={analyticsData.engagement.breakdown.shares}
                total={analyticsData.engagement.total}
                color="bg-purple-600"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Family Tree Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Members</span>
                <Badge className="bg-blue-100 text-blue-800">{analyticsData.familyTree.totalMembers}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Added This Month</span>
                <Badge className="bg-green-100 text-green-800">+{analyticsData.familyTree.newThisMonth}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Generations Mapped</span>
                <Badge className="bg-purple-100 text-purple-800">{analyticsData.familyTree.generations}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Tree Completeness</span>
                  <span className="font-semibold text-gray-900">{analyticsData.familyTree.completeness}%</span>
                </div>
                <Progress value={analyticsData.familyTree.completeness} className="h-2" />
                <p className="text-xs text-gray-500">Add more details to improve your family tree</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Performing Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformingContent.map((content, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{content.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {content.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{content.date}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <Eye className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                      <span className="font-semibold">{content.views}</span>
                    </div>
                    <div className="text-center">
                      <Heart className="w-4 h-4 mx-auto mb-1 text-red-600" />
                      <span className="font-semibold">{content.engagement}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.action}</span> {activity.user}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Growth Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{rec.title}</h4>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                      </div>
                      <Badge
                        className={`ml-2 ${
                          rec.impact === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {rec.impact}
                      </Badge>
                    </div>
                    <Progress value={rec.progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{rec.progress}% complete</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <StatCard
            title="Events Attended"
            value={analyticsData.events.attended}
            icon={<Calendar className="w-5 h-5 text-purple-600" />}
          />
          <StatCard
            title="Events Created"
            value={analyticsData.events.created}
            icon={<Calendar className="w-5 h-5 text-green-600" />}
          />
          <StatCard
            title="Posts Created"
            value={analyticsData.content.posts}
            icon={<MessageSquare className="w-5 h-5 text-blue-600" />}
          />
          <StatCard
            title="Total Reactions"
            value={analyticsData.content.reactions}
            icon={<Heart className="w-5 h-5 text-red-600" />}
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  trend,
  icon,
  color,
  isRank = false
}: {
  title: string;
  value: string;
  trend: number;
  icon: JSX.Element;
  color: string;
  isRank?: boolean;
}) {
  const isPositive = isRank ? trend < 0 : trend > 0;
  const TrendIcon = isPositive ? ArrowUp : ArrowDown;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-${color}-100`}>{icon}</div>
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <TrendIcon className="w-4 h-4" />
            {Math.abs(trend)}%
          </div>
        </div>
        <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
}

function EngagementBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percentage = (value / total) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-700">{label}</span>
        <span className="font-semibold text-gray-900">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: JSX.Element }) {
  return (
    <Card className="text-center hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-center mb-3">{icon}</div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </CardContent>
    </Card>
  );
}

const recommendations = [
  {
    title: 'Complete your profile',
    description: 'Add your education and occupation details',
    impact: 'High',
    progress: 75
  },
  {
    title: 'Expand your network',
    description: 'Connect with 10 more community members',
    impact: 'Medium',
    progress: 40
  },
  {
    title: 'Share heritage stories',
    description: "Document your family's cultural traditions",
    impact: 'High',
    progress: 20
  }
];
