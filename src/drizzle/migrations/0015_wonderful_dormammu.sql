CREATE TYPE "public"."achievement_category" AS ENUM('Healthcare', 'Sports', 'Technology', 'Education', 'Business', 'Arts');--> statement-breakpoint
CREATE TYPE "public"."achievement_status" AS ENUM('active', 'inactive', 'removed');--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"category" "achievement_category" NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_hall_of_fame" boolean DEFAULT false NOT NULL,
	"year" integer NOT NULL,
	"location" varchar(255) NOT NULL,
	"key_achievement" text NOT NULL,
	"impact" text NOT NULL,
	"achievements" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" "achievement_status" DEFAULT 'active' NOT NULL,
	"created_by" varchar(150) NOT NULL,
	"created_by_id" varchar(100) NOT NULL,
	"removed_by" varchar(150),
	"removed_by_id" varchar(100),
	"removed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
