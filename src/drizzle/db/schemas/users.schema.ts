import { pgTable, serial, varchar, text, date, timestamp, boolean } from "drizzle-orm/pg-core";
import { genderEnum } from "../enums/gender.enum";
import { memberCategoryEnum } from "../enums/memberCategory.enum";
// import { verificationStatusEnum } from "../enums/verificationStatus.enum";
// import { accountStatusEnum } from "../enums/accountStatus.enum";
// import { roleEnum } from "../enums/role.enum";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  dateOfBirth: date("date_of_birth"),
  gender: genderEnum("gender"),
  profilePhoto: varchar("profile_photo", { length: 255 }),
  bio: text("bio"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 255 }).default("India"),
  memberCategory: memberCategoryEnum("member_category"),
  // verificationStatus: verificationStatusEnum("verification_status").default("pending"),
  // accountStatus: accountStatusEnum("account_status").default("inactive"),
  // role: roleEnum("role").default("member"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
  lastLogin: timestamp("last_login"),
  emailVerified: boolean("email_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
});
