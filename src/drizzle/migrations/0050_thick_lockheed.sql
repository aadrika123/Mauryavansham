ALTER TABLE "users" ADD COLUMN "user_code" varchar(50);--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "branch_offices" json DEFAULT '[]';--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "cin" text;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "gst" text;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "udyam" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_code_unique" UNIQUE("user_code");