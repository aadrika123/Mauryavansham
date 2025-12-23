export type BadgeType =
  | "early_adopter"
  | "community_helper"
  | "event_organizer"
  | "top_contributor"
  | "genealogy_expert"
  | "verified_member"
  | "premium_member"
  | "elite_member"
  | "heritage_guardian"
  | "matchmaker"
  | "business_leader"

export interface Badge {
  id: string
  type: BadgeType
  name: string
  description: string
  icon: string
  color: string
  requirement: string
  points: number
}

export interface UserBadge {
  userId: string
  badgeId: string
  badge: Badge
  earnedAt: Date
  visible: boolean
}

export interface UserReputation {
  userId: string
  totalPoints: number
  level: number
  rank: string
  badges: UserBadge[]
  contributions: {
    profilesViewed: number
    eventsAttended: number
    eventsCreated: number
    postsCreated: number
    commentsAdded: number
    familyTreeMembers: number
    referrals: number
  }
}

export const REPUTATION_LEVELS = [
  { level: 1, minPoints: 0, rank: "Newcomer", color: "gray" },
  { level: 2, minPoints: 100, rank: "Member", color: "blue" },
  { level: 3, minPoints: 500, rank: "Active Member", color: "green" },
  { level: 4, minPoints: 1500, rank: "Valued Member", color: "purple" },
  { level: 5, minPoints: 5000, rank: "Community Leader", color: "orange" },
  { level: 6, minPoints: 15000, rank: "Legend", color: "red" },
]

export const BADGES: Badge[] = [
  {
    id: "early_adopter",
    type: "early_adopter",
    name: "Early Adopter",
    description: "Joined in the first 1000 members",
    icon: "🌟",
    color: "gold",
    requirement: "Join early",
    points: 100,
  },
  {
    id: "community_helper",
    type: "community_helper",
    name: "Community Helper",
    description: "Helped 50+ community members",
    icon: "🤝",
    color: "blue",
    requirement: "50 helpful interactions",
    points: 500,
  },
  {
    id: "event_organizer",
    type: "event_organizer",
    name: "Event Organizer",
    description: "Created 10+ successful events",
    icon: "📅",
    color: "purple",
    requirement: "10 events created",
    points: 300,
  },
  {
    id: "top_contributor",
    type: "top_contributor",
    name: "Top Contributor",
    description: "Top 1% most active members",
    icon: "🏆",
    color: "gold",
    requirement: "Be in top 1%",
    points: 1000,
  },
  {
    id: "genealogy_expert",
    type: "genealogy_expert",
    name: "Genealogy Expert",
    description: "Built family tree with 100+ members",
    icon: "🌳",
    color: "green",
    requirement: "100 family tree members",
    points: 400,
  },
  {
    id: "verified_member",
    type: "verified_member",
    name: "Verified Member",
    description: "Completed profile verification",
    icon: "✓",
    color: "green",
    requirement: "Complete verification",
    points: 50,
  },
  {
    id: "premium_member",
    type: "premium_member",
    name: "Premium Member",
    description: "Active premium subscription",
    icon: "👑",
    color: "orange",
    requirement: "Subscribe to premium",
    points: 200,
  },
  {
    id: "heritage_guardian",
    type: "heritage_guardian",
    name: "Heritage Guardian",
    description: "Contributed 20+ heritage stories",
    icon: "📜",
    color: "brown",
    requirement: "20 heritage contributions",
    points: 600,
  },
  {
    id: "matchmaker",
    type: "matchmaker",
    name: "Matchmaker",
    description: "Helped create 5 successful matches",
    icon: "💑",
    color: "pink",
    requirement: "5 successful referrals",
    points: 800,
  },
  {
    id: "business_leader",
    type: "business_leader",
    name: "Business Leader",
    description: "Top rated business profile",
    icon: "💼",
    color: "navy",
    requirement: "4.5+ star business rating",
    points: 400,
  },
]
