CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."member_category" AS ENUM('government', 'private', 'business', 'student', 'retired', 'other');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"phone" varchar(15),
	"role" varchar(20) DEFAULT 'user',
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"profile_id" serial NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
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
	"name" varchar(100),
	"nick_name" varchar(100),
	"phone_no" varchar(15),
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
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_premium" boolean DEFAULT false,
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"is_deleted" boolean DEFAULT false,
	"profile_picture" varchar(255) DEFAULT ''
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;