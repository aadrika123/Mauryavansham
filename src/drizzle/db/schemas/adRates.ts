import { pgTable, serial, date, numeric, timestamp } from "drizzle-orm/pg-core";

export const adRates = pgTable("ad_rates", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  rate: numeric("rate").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
