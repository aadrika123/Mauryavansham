'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Award, TrendingUp, Users, Target, Loader2 } from 'lucide-react';
import { Card } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Progress } from '@/src/components/ui/progress';
import { BADGES, REPUTATION_LEVELS } from '@/src/types/gamification';

export default function GamificationPage() {
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    level: 1,
    rank: 'Newcomer',
    earnedBadges: [] as string[],
    contributions: {
      profilesViewed: 0,
      eventsAttended: 0,
      eventsCreated: 0,
      postsCreated: 0,
      commentsAdded: 0,
      familyTreeMembers: 0,
      referrals: 0
    },
    streak: 0,
    longestStreak: 0,
    globalRank: null as number | null,
    communityRank: null as number | null
  });

  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        const response = await fetch('/api/gamification/stats');
        if (!response.ok) throw new Error('Failed to fetch gamification stats');

        const data = await response.json();
        setUserStats(data);
      } catch (error) {
        console.error('[v0] Error fetching gamification data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGamificationData();
  }, []);

  const currentLevel = REPUTATION_LEVELS.find(l => l.level === userStats.level);
  const nextLevel = REPUTATION_LEVELS.find(l => l.level === userStats.level + 1);
  const progressToNext = nextLevel
    ? ((userStats.totalPoints - currentLevel!.minPoints) / (nextLevel.minPoints - currentLevel!.minPoints)) * 100
    : 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading your achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-600" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Your Achievements</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your progress, earn badges, and climb the community leaderboard
          </p>
        </div>

        {/* User Level Card */}
        <Card className="p-8 mb-8 bg-gradient-to-br from-purple-100 to-orange-100 border-2 border-purple-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-orange-600 flex items-center justify-center text-white text-3xl font-bold">
                {userStats.level}
              </div>
              <div>
                <Badge className="bg-purple-600 text-white mb-2">{currentLevel?.rank}</Badge>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {userStats.totalPoints.toLocaleString()} Points
                </h2>
                <p className="text-gray-600">
                  {nextLevel
                    ? `${nextLevel.minPoints - userStats.totalPoints} points to ${nextLevel.rank}`
                    : 'Maximum level reached!'}
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-700">Level Progress</span>
                <span className="text-gray-700 font-semibold">{Math.round(progressToNext)}%</span>
              </div>
              <Progress value={progressToNext} className="h-3" />
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-3xl font-bold text-gray-900">{userStats.contributions.profilesViewed}</div>
            <div className="text-sm text-gray-600">Profiles Viewed</div>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-3xl font-bold text-gray-900">{userStats.contributions.eventsAttended}</div>
            <div className="text-sm text-gray-600">Events Attended</div>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-3xl font-bold text-gray-900">{userStats.contributions.postsCreated}</div>
            <div className="text-sm text-gray-600">Posts Created</div>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Award className="w-8 h-8 mx-auto mb-2 text-orange-600" />
            <div className="text-3xl font-bold text-gray-900">{userStats.earnedBadges.length}</div>
            <div className="text-sm text-gray-600">Badges Earned</div>
          </Card>
        </div>

        {/* Badges Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-8 h-8 text-yellow-600" />
            <h2 className="text-3xl font-bold text-gray-900">Your Badges</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BADGES.map(badge => {
              const isEarned = userStats.earnedBadges.includes(badge.type);
              return (
                <Card
                  key={badge.id}
                  className={`p-6 ${
                    isEarned
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400'
                      : 'bg-gray-50 opacity-60'
                  } hover:shadow-lg transition-all`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`text-4xl ${isEarned ? '' : 'grayscale'}`}>{badge.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900">{badge.name}</h3>
                        {isEarned && <Badge className="bg-green-600 text-white text-xs">Earned</Badge>}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{badge.requirement}</span>
                        <span className="text-sm font-semibold text-orange-600">+{badge.points} pts</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Reputation Levels */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Reputation Levels</h2>
          <div className="space-y-4">
            {REPUTATION_LEVELS.map((level, index) => {
              const isCurrentLevel = level.level === userStats.level;
              const isAchieved = userStats.totalPoints >= level.minPoints;

              return (
                <div
                  key={level.level}
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    isCurrentLevel
                      ? 'bg-gradient-to-r from-purple-100 to-orange-100 border-2 border-purple-400'
                      : isAchieved
                        ? 'bg-green-50'
                        : 'bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      isAchieved ? `bg-${level.color}-600` : 'bg-gray-400'
                    }`}
                  >
                    {level.level}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{level.rank}</h3>
                      {isCurrentLevel && <Badge className="bg-purple-600 text-white">Current</Badge>}
                      {isAchieved && !isCurrentLevel && <Badge className="bg-green-600 text-white">Achieved</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{level.minPoints.toLocaleString()}+ points required</p>
                  </div>
                  {isAchieved && (
                    <div className="text-green-600">
                      <Trophy className="w-6 h-6" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">How to Earn Points</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
              <span className="text-2xl">👁️</span>
              <div>
                <div className="font-semibold">View profiles</div>
                <div className="text-sm text-gray-600">+2 points per view</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
              <span className="text-2xl">✍️</span>
              <div>
                <div className="font-semibold">Create posts</div>
                <div className="text-sm text-gray-600">+10 points per post</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
              <span className="text-2xl">📅</span>
              <div>
                <div className="font-semibold">Attend events</div>
                <div className="text-sm text-gray-600">+15 points per event</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
              <span className="text-2xl">🌳</span>
              <div>
                <div className="font-semibold">Add family members</div>
                <div className="text-sm text-gray-600">+5 points per member</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
              <span className="text-2xl">🤝</span>
              <div>
                <div className="font-semibold">Refer friends</div>
                <div className="text-sm text-gray-600">+50 points per referral</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg">
              <span className="text-2xl">💬</span>
              <div>
                <div className="font-semibold">Comment & engage</div>
                <div className="text-sm text-gray-600">+3 points per comment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
