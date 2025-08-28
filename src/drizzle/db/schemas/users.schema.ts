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
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),

  // Basic info
  phone: varchar("phone", { length: 15 }),
  role: varchar("role", { length: 20 }).default("user"),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  profileId: serial("profile_id"),

  // Profile-related fields
  gender: varchar("gender", { length: 10 }),
  dateOfBirth: date("date_of_birth"),
  address: text("address"),
  photo: varchar("photo", { length: 255 }),

  // Matrimonial extra fields
  maritalStatus: varchar("marital_status", { length: 20 }),
  religion: varchar("religion", { length: 50 }),
  // caste: varchar("caste", { length: 50 }),
  motherTongue: varchar("mother_tongue", { length: 50 }),
  height: varchar("height", { length: 10 }),
  weight: varchar("weight", { length: 10 }),
  bloodGroup: varchar("blood_group", { length: 5 }),

  education: varchar("education", { length: 100 }),
  occupation: varchar("occupation", { length: 100 }),
  company: varchar("company", { length: 100 }),
  income: varchar("income", { length: 50 }),

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
});
