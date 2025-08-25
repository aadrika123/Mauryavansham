ALTER TABLE "users" ADD COLUMN "marital_status" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "religion" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "caste" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mother_tongue" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "height" varchar(10);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "weight" varchar(10);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "blood_group" varchar(5);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "education" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "occupation" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "company" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "income" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "diet" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "smoking" varchar(10);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "drinking" varchar(10);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hobbies" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "father_name" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "mother_name" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "siblings_count" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "family_status" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "native_place" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "city" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "state" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "zip_code" varchar(15);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_profile_update" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_completion" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_premium" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "membership_expires_at" timestamp;