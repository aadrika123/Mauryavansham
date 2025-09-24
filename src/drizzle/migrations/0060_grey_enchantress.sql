ALTER TABLE "events" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "status" varchar(20) DEFAULT 'pending' NOT NULL;