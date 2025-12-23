CREATE TABLE "password_reset_otps" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"otp" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "profile_relation" varchar(100);--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "custom_relation" varchar(100);
