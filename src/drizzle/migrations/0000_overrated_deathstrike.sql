CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."member_category" AS ENUM('government', 'private', 'business', 'student', 'retired', 'other');--> statement-breakpoint
CREATE TYPE "public"."ad_status" AS ENUM('pending', 'approved', 'rejected', 'expired');--> statement-breakpoint
CREATE TYPE "public"."blog_status" AS ENUM('draft', 'pending', 'approved', 'rejected', 'removed');--> statement-breakpoint
CREATE TYPE "public"."discussion_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"user_code" varchar(50),
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"about_me" text,
	"phone" varchar(15),
	"role" varchar(20) DEFAULT 'user',
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"profile_id" serial NOT NULL,
	"is_approved" boolean DEFAULT false,
	"gender" varchar(10),
	"date_of_birth" date,
	"address" text,
	"photo" varchar(255),
	"marital_status" varchar(20),
	"mother_tongue" varchar(50),
	"height" varchar(10),
	"weight" varchar(10),
	"blood_group" varchar(5),
	"last_active_at" timestamp,
	"education" varchar(100),
	"occupation" varchar(100),
	"job_type" varchar(50),
	"gov_sector" varchar(50),
	"department" varchar(100),
	"posting_location" varchar(100),
	"designation" varchar(100),
	"company" varchar(100),
	"business_details" varchar(255),
	"status" varchar(20) DEFAULT 'pending',
	"father_name" varchar(100),
	"mother_name" varchar(100),
	"spouse_name" varchar(100),
	"profession_group" varchar(100),
	"profession" varchar(150),
	"profession_details" text,
	"facebook_link" varchar(255),
	"city" varchar(50),
	"state" varchar(50),
	"country" varchar(50),
	"zip_code" varchar(15),
	"last_profile_update" timestamp,
	"profile_completion" integer DEFAULT 0,
	"is_premium" boolean DEFAULT false,
	"membership_expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deactivated_reason" text,
	"current_address" text,
	"current_city" varchar(50),
	"current_state" varchar(50),
	"current_country" varchar(50),
	"current_zip_code" varchar(15),
	CONSTRAINT "users_user_code_unique" UNIQUE("user_code"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" integer NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "members" (
	"registration_id" serial PRIMARY KEY NOT NULL,
	"family_head_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"gotra" varchar(100),
	"address" text,
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(255) DEFAULT 'India',
	"occupation" varchar(100),
	"business_name" varchar(100),
	"family_members" integer DEFAULT 0,
	"agree_to_terms" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"roles" varchar(50) DEFAULT 'member',
	CONSTRAINT "members_email_unique" UNIQUE("email"),
	CONSTRAINT "members_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"name" varchar(100),
	"profile_relation" varchar(100),
	"custom_relation" varchar(100),
	"nick_name" varchar(100),
	"phone_no" varchar(15),
	"gender" varchar(10),
	"email" varchar(100),
	"website" varchar(100),
	"dob" varchar(10),
	"height" varchar(10),
	"weight" varchar(10),
	"complexion" varchar(50),
	"body_type" varchar(50),
	"marital_status" varchar(50),
	"languages_known" varchar(100),
	"hobbies" varchar(100),
	"about_me" text,
	"highest_education" varchar(100),
	"college_university" varchar(100),
	"occupation" varchar(100),
	"company_organization" varchar(100),
	"designation" varchar(100),
	"work_location" varchar(100),
	"annual_income" varchar(100),
	"work_experience" varchar(100),
	"father_name" varchar(100),
	"father_occupation" varchar(100),
	"mother_name" varchar(100),
	"mother_occupation" varchar(100),
	"brothers" varchar(100),
	"sisters" varchar(100),
	"brothers_details" json DEFAULT '[]',
	"sisters_details" json DEFAULT '[]',
	"family_income" varchar(100),
	"gotra_details" varchar(100),
	"ancestral_village" varchar(100),
	"family_history" text,
	"community_contributions" text,
	"family_traditions" text,
	"diet" varchar(100),
	"smoking" varchar(100),
	"drinking" varchar(100),
	"exercise" varchar(100),
	"religious_beliefs" varchar(100),
	"music_preferences" varchar(100),
	"movie_preferences" varchar(100),
	"reading_interests" varchar(100),
	"travel_interests" varchar(100),
	"cast_preferences" varchar(100),
	"facebook" varchar(100) DEFAULT '',
	"instagram" varchar(100) DEFAULT '',
	"linkedin" varchar(100) DEFAULT '',
	"profile_picture" varchar(255) DEFAULT '',
	"profile_image1" varchar(255) DEFAULT '',
	"profile_image2" varchar(255) DEFAULT '',
	"profile_image3" varchar(255) DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_premium" boolean DEFAULT false,
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"is_deleted" boolean DEFAULT false,
	"deactivate_reason" varchar(500),
	"deactivate_review" text
);
--> statement-breakpoint
CREATE TABLE "password_reset_otps" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"otp" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ads" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"banner_image_url" text NOT NULL,
	"from_date" date NOT NULL,
	"to_date" date NOT NULL,
	"user_id" integer NOT NULL,
	"status" "ad_status" DEFAULT 'pending' NOT NULL,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp,
	"placement_id" integer NOT NULL,
	"views" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"summary" text NOT NULL,
	"author_id" integer NOT NULL,
	"image_url" text NOT NULL,
	"status" "blog_status" DEFAULT 'draft' NOT NULL,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp,
	"remove_reason" text,
	"removed_by" integer
);
--> statement-breakpoint
CREATE TABLE "ad_placements" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_name" varchar(100) NOT NULL,
	"section_name" varchar(100) NOT NULL,
	"description" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "discussions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"author_id" varchar(50) NOT NULL,
	"author_name" varchar(100) NOT NULL,
	"location" varchar(100),
	"likes" integer DEFAULT 0 NOT NULL,
	"replies" integer DEFAULT 0 NOT NULL,
	"status" "discussion_status" DEFAULT 'pending' NOT NULL,
	"approved_by" varchar(50),
	"approved_by_id" varchar(50),
	"approved_at" timestamp,
	"rejected_by" varchar(50),
	"rejected_by_id" varchar(50),
	"rejected_at" timestamp,
	"rejection_reason" text,
	"is_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discussion_replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"discussion_id" integer NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"user_name" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"parent_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discussion_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"discussion_id" integer NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discussion_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_approvals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"admin_id" integer NOT NULL,
	"admin_name" varchar(100) NOT NULL,
	"status" varchar(20) DEFAULT 'approved',
	"created_at" timestamp DEFAULT now(),
	"reason" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(50) NOT NULL,
	"message" varchar(500) NOT NULL,
	"user_id" integer,
	"sender_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_reads" (
	"id" serial PRIMARY KEY NOT NULL,
	"notification_id" integer NOT NULL,
	"admin_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"image" varchar(500),
	"date" date NOT NULL,
	"from_time" time NOT NULL,
	"to_time" time NOT NULL,
	"location" varchar(255) NOT NULL,
	"attendees" integer DEFAULT 0,
	"max_attendees" integer NOT NULL,
	"organizer" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"category" varchar(100),
	"is_featured" boolean DEFAULT false,
	"reason" text,
	"rejected_by" varchar(255),
	"user_id" integer,
	"status" varchar(20) DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_attendees" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ad_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"rate" numeric NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_siblings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"gender" varchar(10),
	"date_of_birth" date,
	"occupation" varchar(100),
	"marital_status" varchar(20),
	"spouse_name" varchar(100),
	"details" text
);
--> statement-breakpoint
CREATE TABLE "user_children" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(100),
	"gender" varchar(10),
	"date_of_birth" date,
	"studying_or_working" varchar(50),
	"marital_status" varchar(20),
	"spouse_name" varchar(100),
	"details" text
);
--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"organization_name" text NOT NULL,
	"organization_type" text NOT NULL,
	"business_category" text NOT NULL,
	"business_description" text NOT NULL,
	"partners" json DEFAULT '[]',
	"categories" json DEFAULT '[]',
	"date_of_establishment" json DEFAULT 'null',
	"company_website" text,
	"official_email" text,
	"official_contact_number" text,
	"registered_address" json NOT NULL,
	"branch_offices" json DEFAULT '[]',
	"cin" text,
	"gst" text,
	"udyam" text,
	"photos" json DEFAULT '{"product":[],"office":[]}',
	"premium_category" text NOT NULL,
	"payment_status" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profile_interests" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_user_id" varchar(255) NOT NULL,
	"sender_profile_id" varchar(255) NOT NULL,
	"receiver_user_id" varchar(255) NOT NULL,
	"receiver_profile_id" varchar(255) NOT NULL,
	"sender_profile" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discussions_reply_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"reply_id" integer NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" integer NOT NULL,
	"receiver_id" integer NOT NULL,
	"text" varchar(1000) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"user1_id" integer NOT NULL,
	"user2_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ads" ADD CONSTRAINT "ads_placement_id_ad_placements_id_fk" FOREIGN KEY ("placement_id") REFERENCES "public"."ad_placements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_removed_by_users_id_fk" FOREIGN KEY ("removed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_replies" ADD CONSTRAINT "discussion_replies_discussion_id_discussions_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_likes" ADD CONSTRAINT "discussion_likes_discussion_id_discussions_id_fk" FOREIGN KEY ("discussion_id") REFERENCES "public"."discussions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_approvals" ADD CONSTRAINT "user_approvals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_approvals" ADD CONSTRAINT "user_approvals_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_reads" ADD CONSTRAINT "notification_reads_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_siblings" ADD CONSTRAINT "user_siblings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_children" ADD CONSTRAINT "user_children_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussions_reply_likes" ADD CONSTRAINT "discussions_reply_likes_reply_id_discussion_replies_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."discussion_replies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
