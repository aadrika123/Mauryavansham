import { pgTable, serial, varchar, text, timestamp, integer, pgEnum, decimal, boolean } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { users } from "@/src/drizzle/schema" // Updated import path

// Define ENUMs for matrimonial features
export const maritalStatusEnum = pgEnum("marital_status", ["never_married", "divorced", "widowed"])
export const profileVisibilityEnum = pgEnum("profile_visibility", ["public", "members_only", "private"])
export const interestTypeEnum = pgEnum("interest_type", ["interest", "shortlist", "contact_request"])
export const interestStatusEnum = pgEnum("interest_status", ["pending", "accepted", "declined"])

// Matrimonial profiles table
export const matrimonialProfiles = pgTable("matrimonial_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  maritalStatus: maritalStatusEnum("marital_status").notNull(),
  height: integer("height"), // in cm
  weight: integer("weight"), // in kg
  education: varchar("education", { length: 255 }),
  occupation: varchar("occupation", { length: 255 }),
  annualIncome: decimal("annual_income", { precision: 12, scale: 2 }),
  religion: varchar("religion", { length: 100 }).default("Hindu"),
  caste: varchar("caste", { length: 100 }).default("Maurya"),
  subcaste: varchar("subcaste", { length: 100 }),
  motherTongue: varchar("mother_tongue", { length: 50 }),
  languagesKnown: text("languages_known"),
  hobbies: text("hobbies"),
  aboutMe: text("about_me"),
  aboutFamily: text("about_family"),
  expectations: text("expectations"),
  profileVisibility: profileVisibilityEnum("profile_visibility").default("members_only"),
  isActive: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// Matrimonial preferences table
export const matrimonialPreferences = pgTable("matrimonial_preferences", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => matrimonialProfiles.id, { onDelete: "cascade" }),
  preferredAgeMin: integer("preferred_age_min"),
  preferredAgeMax: integer("preferred_age_max"),
  preferredHeightMin: integer("preferred_height_min"),
  preferredHeightMax: integer("preferred_height_max"),
  preferredEducation: text("preferred_education"),
  preferredOccupation: text("preferred_occupation"),
  preferredIncomeMin: decimal("preferred_income_min", { precision: 12, scale: 2 }),
  preferredLocation: text("preferred_location"),
  preferredMaritalStatus: text("preferred_marital_status"),
  otherPreferences: text("other_preferences"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// Matrimonial interests table
export const matrimonialInterests = pgTable("matrimonial_interests", {
  id: serial("id").primaryKey(),
  senderProfileId: integer("sender_profile_id")
    .notNull()
    .references(() => matrimonialProfiles.id, { onDelete: "cascade" }),
  receiverProfileId: integer("receiver_profile_id")
    .notNull()
    .references(() => matrimonialProfiles.id, { onDelete: "cascade" }),
  interestType: interestTypeEnum("interest_type").notNull(),
  status: interestStatusEnum("status").default("pending").notNull(),
  message: text("message"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// Relations for matrimonial profiles
export const matrimonialProfilesRelations = relations(matrimonialProfiles, ({ one, many }) => ({
  user: one(users, { fields: [matrimonialProfiles.userId], references: [users.id] }),
  preferences: one(matrimonialPreferences, {
    fields: [matrimonialProfiles.id],
    references: [matrimonialPreferences.profileId],
  }),
  sentInterests: many(matrimonialInterests, { relationName: "sent" }),
  receivedInterests: many(matrimonialInterests, { relationName: "received" }),
}))

export const matrimonialPreferencesRelations = relations(matrimonialPreferences, ({ one }) => ({
  profile: one(matrimonialProfiles, {
    fields: [matrimonialPreferences.profileId],
    references: [matrimonialProfiles.id],
  }),
}))

export const matrimonialInterestsRelations = relations(matrimonialInterests, ({ one }) => ({
  senderProfile: one(matrimonialProfiles, {
    fields: [matrimonialInterests.senderProfileId],
    references: [matrimonialProfiles.id],
    relationName: "sent",
  }),
  receiverProfile: one(matrimonialProfiles, {
    fields: [matrimonialInterests.receiverProfileId],
    references: [matrimonialProfiles.id],
    relationName: "received",
  }),
}))
