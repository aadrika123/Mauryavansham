ALTER TABLE "profiles" DROP CONSTRAINT "profiles_user_id_unique";--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "profile_image1" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "profile_image2" varchar(255) DEFAULT '';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "profile_image3" varchar(255) DEFAULT '';