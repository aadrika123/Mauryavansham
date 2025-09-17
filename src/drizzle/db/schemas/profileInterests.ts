// src/drizzle/db/schemas/profileInterests.schema.ts
import { pgTable, serial, varchar, timestamp, json } from "drizzle-orm/pg-core";

export const profileInterests = pgTable("profile_interests", {
  id: serial("id").primaryKey(),

  senderUserId: varchar("sender_user_id", { length: 255 }).notNull(), // jis user ne interest bheja
  senderProfileId: varchar("sender_profile_id", { length: 255 }).notNull(), // us user ka profile id

  receiverUserId: varchar("receiver_user_id", { length: 255 }).notNull(), // jisko mila
  receiverProfileId: varchar("receiver_profile_id", { length: 255 }).notNull(), // receiver ka profile id

  senderProfile: json("sender_profile").notNull(), // sender ka pura profile JSON cache ke liye

  createdAt: timestamp("created_at").defaultNow().notNull(), // kab interest bheja gaya
});
