import { pgTable, serial, integer, timestamp, boolean, varchar, text, decimal } from "drizzle-orm/pg-core"
import { users } from "./users.schema"
import { subscriptionTierEnum, subscriptionStatusEnum } from "../enums/subscription.enum"

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Subscription details
  tier: subscriptionTierEnum("tier").notNull().default("free"),
  status: subscriptionStatusEnum("status").notNull().default("active"),

  // Billing
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  currency: varchar("currency", { length: 3 }).notNull().default("INR"),
  billingCycle: varchar("billing_cycle", { length: 20 }).notNull().default("monthly"),

  // Dates
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date").notNull(),
  trialEndsAt: timestamp("trial_ends_at"),

  // Settings
  autoRenew: boolean("auto_renew").notNull().default(true),
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),

  // Payment tracking
  paymentGateway: varchar("payment_gateway", { length: 50 }),
  transactionId: varchar("transaction_id", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const billingHistory = pgTable("billing_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),

  // Transaction details
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("INR"),
  status: varchar("status", { length: 20 }).notNull(), // success, failed, pending, refunded

  // Payment info
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentGateway: varchar("payment_gateway", { length: 50 }),
  transactionId: varchar("transaction_id", { length: 255 }),
  gatewayResponse: text("gateway_response"),

  // Invoice
  invoiceNumber: varchar("invoice_number", { length: 50 }),
  invoiceUrl: varchar("invoice_url", { length: 255 }),

  // Metadata
  description: text("description"),
  metadata: text("metadata"), // JSON string for additional data

  createdAt: timestamp("created_at").defaultNow(),
})
