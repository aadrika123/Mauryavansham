CREATE TYPE "public"."subscription_status" AS ENUM('active', 'cancelled', 'expired', 'trial');--> statement-breakpoint
CREATE TYPE "public"."subscription_tier" AS ENUM('free', 'basic', 'premium', 'elite');--> statement-breakpoint
CREATE TYPE "public"."verification_level" AS ENUM('unverified', 'basic', 'verified', 'elite_verified');--> statement-breakpoint
CREATE TABLE "billing_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"subscription_id" integer,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"status" varchar(20) NOT NULL,
	"payment_method" varchar(50),
	"payment_gateway" varchar(50),
	"transaction_id" varchar(255),
	"gateway_response" text,
	"invoice_number" varchar(50),
	"invoice_url" varchar(255),
	"description" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"tier" "subscription_tier" DEFAULT 'free' NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"currency" varchar(3) DEFAULT 'INR' NOT NULL,
	"billing_cycle" varchar(20) DEFAULT 'monthly' NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp NOT NULL,
	"trial_ends_at" timestamp,
	"auto_renew" boolean DEFAULT true NOT NULL,
	"cancelled_at" timestamp,
	"cancellation_reason" text,
	"payment_gateway" varchar(50),
	"transaction_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"badge_type" varchar(50) NOT NULL,
	"badge_name" varchar(100) NOT NULL,
	"badge_description" text,
	"badge_icon" varchar(50),
	"badge_color" varchar(50),
	"points_earned" integer DEFAULT 0 NOT NULL,
	"earned_at" timestamp DEFAULT now() NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"requirement" text,
	"metadata" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_reputation" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"rank" varchar(50) DEFAULT 'Newcomer' NOT NULL,
	"profiles_viewed" integer DEFAULT 0 NOT NULL,
	"events_attended" integer DEFAULT 0 NOT NULL,
	"events_created" integer DEFAULT 0 NOT NULL,
	"posts_created" integer DEFAULT 0 NOT NULL,
	"comments_added" integer DEFAULT 0 NOT NULL,
	"family_tree_members" integer DEFAULT 0 NOT NULL,
	"referrals" integer DEFAULT 0 NOT NULL,
	"helpful_interactions" integer DEFAULT 0 NOT NULL,
	"heritage_contributions" integer DEFAULT 0 NOT NULL,
	"global_rank" integer,
	"community_rank" integer,
	"last_points_earned" timestamp,
	"streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_reputation_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_verification" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"verification_level" "verification_level" DEFAULT 'unverified' NOT NULL,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"is_phone_verified" boolean DEFAULT false NOT NULL,
	"is_id_verified" boolean DEFAULT false NOT NULL,
	"is_address_verified" boolean DEFAULT false NOT NULL,
	"is_photo_verified" boolean DEFAULT false NOT NULL,
	"id_document_type" varchar(50),
	"id_document_number" varchar(100),
	"id_document_url" varchar(255),
	"address_proof_url" varchar(255),
	"is_facebook_verified" boolean DEFAULT false NOT NULL,
	"is_linkedin_verified" boolean DEFAULT false NOT NULL,
	"trust_score" integer DEFAULT 0 NOT NULL,
	"report_count" integer DEFAULT 0 NOT NULL,
	"verified_by" integer,
	"verification_notes" text,
	"verified_at" timestamp,
	"badge_color" varchar(50) DEFAULT 'green',
	"badge_label" varchar(50) DEFAULT 'Verified',
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_verification_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "subscription_tier" "subscription_tier" DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verification_level" "verification_level" DEFAULT 'unverified' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "trust_score" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "video_profile_url" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "video_profile_status" varchar(20) DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "discussions" ADD COLUMN "user_id" integer;--> statement-breakpoint
ALTER TABLE "discussions" ADD COLUMN "reply_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "billing_history" ADD CONSTRAINT "billing_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "billing_history" ADD CONSTRAINT "billing_history_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_reputation" ADD CONSTRAINT "user_reputation_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_verification" ADD CONSTRAINT "user_verification_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;