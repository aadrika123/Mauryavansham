import { pgEnum } from "drizzle-orm/pg-core"

export const subscriptionTierEnum = pgEnum("subscription_tier", ["free", "basic", "premium", "elite"])

export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "cancelled", "expired", "trial"])

export const verificationLevelEnum = pgEnum("verification_level", ["unverified", "basic", "verified", "elite_verified"])
