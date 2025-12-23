CREATE TABLE "user_siblings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"gender" varchar(10),
	"date_of_birth" date,
	"occupation" varchar(100),
	"marital_status" varchar(20),
	"details" text
);
--> statement-breakpoint
CREATE TABLE "user_children" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(100),
	"gender" varchar(10),
	"date_of_birth" date,
	"studying_or_working" varchar(50),
	"details" text
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_address" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_city" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_state" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_country" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_zip_code" varchar(15);--> statement-breakpoint
ALTER TABLE "user_siblings" ADD CONSTRAINT "user_siblings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_children" ADD CONSTRAINT "user_children_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
