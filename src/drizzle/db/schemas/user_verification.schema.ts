import { pgTable, serial, integer, timestamp, boolean, varchar, text } from "drizzle-orm/pg-core"
import { users } from "./users.schema"
import { verificationLevelEnum } from "../enums/subscription.enum"

export const userVerification = pgTable("user_verification", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),

  // Verification level
  verificationLevel: verificationLevelEnum("verification_level").notNull().default("unverified"),

  // Document verification
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  isPhoneVerified: boolean("is_phone_verified").notNull().default(false),
  isIdVerified: boolean("is_id_verified").notNull().default(false), // Govt ID
  isAddressVerified: boolean("is_address_verified").notNull().default(false),
  isPhotoVerified: boolean("is_photo_verified").notNull().default(false),

  // Verification documents
  idDocumentType: varchar("id_document_type", { length: 50 }), // Aadhar, PAN, Passport, etc.
  idDocumentNumber: varchar("id_document_number", { length: 100 }),
  idDocumentUrl: varchar("id_document_url", { length: 255 }),
  addressProofUrl: varchar("address_proof_url", { length: 255 }),

  // Social verification
  isFacebookVerified: boolean("is_facebook_verified").notNull().default(false),
  isLinkedInVerified: boolean("is_linkedin_verified").notNull().default(false),

  // Trust score
  trustScore: integer("trust_score").notNull().default(0), // 0-100
  reportCount: integer("report_count").notNull().default(0),

  // Admin verification
  verifiedBy: integer("verified_by"), // Admin ID who verified
  verificationNotes: text("verification_notes"),
  verifiedAt: timestamp("verified_at"),

  // Badge details
  badgeColor: varchar("badge_color", { length: 50 }).default("green"),
  badgeLabel: varchar("badge_label", { length: 50 }).default("Verified"),

  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
})
