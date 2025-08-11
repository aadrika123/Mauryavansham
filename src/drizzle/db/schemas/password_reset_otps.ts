import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

export const password_reset_otps = pgTable("password_reset_otps", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  otp: text("otp").notNull(),
  expires_at: timestamp("expires_at").notNull(),
});
