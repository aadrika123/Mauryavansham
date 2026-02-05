import { pgTable, serial, integer, timestamp, boolean, varchar, text } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const userBadges = pgTable('user_badges', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Badge details
  badgeType: varchar('badge_type', { length: 50 }).notNull(),
  badgeName: varchar('badge_name', { length: 100 }).notNull(),
  badgeDescription: text('badge_description'),
  badgeIcon: varchar('badge_icon', { length: 50 }),
  badgeColor: varchar('badge_color', { length: 50 }),

  // Earning details
  pointsEarned: integer('points_earned').notNull().default(0),
  earnedAt: timestamp('earned_at').notNull().defaultNow(),

  // Display settings
  isVisible: boolean('is_visible').notNull().default(true),
  isPinned: boolean('is_pinned').notNull().default(false),

  // Metadata
  requirement: text('requirement'),
  metadata: text('metadata'), // JSON string for additional data

  createdAt: timestamp('created_at').defaultNow()
});

export const userReputation = pgTable('user_reputation', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Reputation metrics
  totalPoints: integer('total_points').notNull().default(0),
  level: integer('level').notNull().default(1),
  rank: varchar('rank', { length: 50 }).notNull().default('Newcomer'),

  // Contribution tracking
  profilesViewed: integer('profiles_viewed').notNull().default(0),
  eventsAttended: integer('events_attended').notNull().default(0),
  eventsCreated: integer('events_created').notNull().default(0),
  postsCreated: integer('posts_created').notNull().default(0),
  commentsAdded: integer('comments_added').notNull().default(0),
  familyTreeMembers: integer('family_tree_members').notNull().default(0),
  referrals: integer('referrals').notNull().default(0),
  helpfulInteractions: integer('helpful_interactions').notNull().default(0),
  heritageContributions: integer('heritage_contributions').notNull().default(0),

  // Rankings
  globalRank: integer('global_rank'),
  communityRank: integer('community_rank'),

  // Metadata
  lastPointsEarned: timestamp('last_points_earned'),
  streak: integer('streak').notNull().default(0), // Days of consecutive activity
  longestStreak: integer('longest_streak').notNull().default(0),

  updatedAt: timestamp('updated_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow()
});
