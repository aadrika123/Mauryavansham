import { pgTable, serial, text, json, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
// import { users } from "./schema";

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(), // FK to users
  organizationName: text("organization_name").notNull(),
  organizationType: text("organization_type").notNull(),
  businessCategory: text("business_category").notNull(),
  businessDescription: text("business_description").notNull(),
  partners: json("partners").default(JSON.stringify([])),
  categories: json("categories").default(JSON.stringify([])),
  dateOfestablishment: json("date_of_establishment").notNull(),

  // Registered + Branch addresses
  registeredAddress: json("registered_address").notNull(),
  branchOffices: json("branch_offices").default(JSON.stringify([])), // ✅ multiple addresses

  // Optional fields
  cin: text("cin"),
  gst: text("gst"),
  udyam: text("udyam"),

  photos: json("photos").default(JSON.stringify({ product: [], office: [] })),
  premiumCategory: text("premium_category").notNull(),
  paymentStatus: boolean("payment_status").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});
