ALTER TABLE "profile_interests" ADD COLUMN "sender_user_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "profile_interests" ADD COLUMN "sender_profile_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "profile_interests" ADD COLUMN "receiver_user_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "profile_interests" ADD COLUMN "receiver_profile_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "profile_interests" DROP COLUMN "sender_id";--> statement-breakpoint
ALTER TABLE "profile_interests" DROP COLUMN "receiver_id";
