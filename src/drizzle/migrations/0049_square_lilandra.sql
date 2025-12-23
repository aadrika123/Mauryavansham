CREATE TABLE "businesses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"organization_name" text NOT NULL,
	"organization_type" text NOT NULL,
	"business_category" text NOT NULL,
	"business_description" text NOT NULL,
	"partners" json DEFAULT '[]',
	"categories" json DEFAULT '[]',
	"registered_address" json NOT NULL,
	"photos" json DEFAULT '{"product":[],"office":[]}',
	"premium_category" text NOT NULL,
	"payment_status" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
