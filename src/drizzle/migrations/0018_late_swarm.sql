ALTER TYPE "public"."achievement_category" ADD VALUE 'Central Government';--> statement-breakpoint
ALTER TYPE "public"."achievement_category" ADD VALUE 'PSU';--> statement-breakpoint
ALTER TYPE "public"."achievement_category" ADD VALUE 'State Government';--> statement-breakpoint
ALTER TYPE "public"."achievement_category" ADD VALUE 'Other';--> statement-breakpoint
ALTER TABLE "achievements" ADD COLUMN "father_name" varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE "achievements" ADD COLUMN "mother_name" varchar(150) NOT NULL;--> statement-breakpoint
ALTER TABLE "achievements" ADD COLUMN "achievement_title" varchar(200) NOT NULL;--> statement-breakpoint
ALTER TABLE "achievements" ADD COLUMN "images" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "achievements" ADD COLUMN "other_category" varchar(200);--> statement-breakpoint
ALTER TABLE "achievements" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "achievements" DROP COLUMN "image";