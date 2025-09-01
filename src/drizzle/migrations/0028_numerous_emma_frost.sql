ALTER TABLE "discussions" ADD COLUMN "rejected_by" varchar(50);--> statement-breakpoint
ALTER TABLE "discussions" ADD COLUMN "rejected_at" timestamp;--> statement-breakpoint
ALTER TABLE "discussions" ADD COLUMN "rejection_reason" text;