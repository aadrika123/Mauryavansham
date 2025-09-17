import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  date,
  text,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  userCode: varchar("user_code", { length: 50 }).unique(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),

  // Basic info
  phone: varchar("phone", { length: 15 }),
  role: varchar("role", { length: 20 }).default("user"),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  profileId: serial("profile_id"),
  isApproved: boolean("is_approved").default(false),

  // Profile-related fields
  gender: varchar("gender", { length: 10 }),
  dateOfBirth: date("date_of_birth"),
  address: text("address"),
  photo: varchar("photo", { length: 255 }),

  // Matrimonial extra fields
  maritalStatus: varchar("marital_status", { length: 20 }),
  // religion: varchar("religion", { length: 50 }),
  // caste: varchar("caste", { length: 50 }),
  motherTongue: varchar("mother_tongue", { length: 50 }),
  height: varchar("height", { length: 10 }),
  weight: varchar("weight", { length: 10 }),
  bloodGroup: varchar("blood_group", { length: 5 }),
  lastActive: timestamp("last_active_at"),

  education: varchar("education", { length: 100 }),
  occupation: varchar("occupation", { length: 100 }),

  // 🆕 Occupation-specific fields
  jobType: varchar("job_type", { length: 50 }), // Government / Non-Government
  govSector: varchar("gov_sector", { length: 50 }), // Central / State / UT
  department: varchar("department", { length: 100 }),
  postingLocation: varchar("posting_location", { length: 100 }),
  designation: varchar("designation", { length: 100 }),
  company: varchar("company", { length: 100 }),
  businessDetails: varchar("business_details", { length: 255 }),
  status: varchar("status", { length: 20 }).default("pending"),
  fatherName: varchar("father_name", { length: 100 }),
  motherName: varchar("mother_name", { length: 100 }),

  // values: "pending" | "approved" | "rejected"

  // ❌ income removed (form me nahi hai ab)

  // diet: varchar("diet", { length: 20 }),
  // smoking: varchar("smoking", { length: 10 }),
  // drinking: varchar("drinking", { length: 10 }),
  // hobbies: text("hobbies"),

  // Location
  city: varchar("city", { length: 50 }),
  state: varchar("state", { length: 50 }),
  country: varchar("country", { length: 50 }),
  zipCode: varchar("zip_code", { length: 15 }),

  // Tracking
  lastProfileUpdate: timestamp("last_profile_update"),
  profileCompletion: integer("profile_completion").default(0),
  isPremium: boolean("is_premium").default(false),
  membershipExpiresAt: timestamp("membership_expires_at"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deactivatedReason: text("deactivated_reason"),

  currentAddress: text("current_address"),
  currentCity: varchar("current_city", { length: 50 }),
  currentState: varchar("current_state", { length: 50 }),
  currentCountry: varchar("current_country", { length: 50 }),
  currentZipCode: varchar("current_zip_code", { length: 15 }),
});
