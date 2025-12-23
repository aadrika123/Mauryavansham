ALTER TABLE "users" ADD COLUMN "job_type" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gov_sector" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "department" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "posting_location" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "designation" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "business_details" varchar(255);--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "income";
