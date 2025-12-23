ALTER TABLE "users" ADD COLUMN "profession_group" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profession" varchar(150);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profession_details" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "facebook_link" varchar(255);--> statement-breakpoint
ALTER TABLE "user_siblings" ADD COLUMN "spouse_name" varchar(100);--> statement-breakpoint
ALTER TABLE "user_children" ADD COLUMN "marital_status" varchar(20);--> statement-breakpoint
ALTER TABLE "user_children" ADD COLUMN "spouse_name" varchar(100);
