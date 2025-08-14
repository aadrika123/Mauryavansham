ALTER TABLE "profiles" ADD COLUMN "user_id" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "gender" varchar(10);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "facebook" varchar(100) DEFAULT '';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "instagram" varchar(100) DEFAULT '';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "linkedin" varchar(100) DEFAULT '';--> statement-breakpoint
-- ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id");