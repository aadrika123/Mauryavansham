ALTER TYPE "public"."blog_status" ADD VALUE 'removed';--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "remove_reason" text;--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "removed_by" integer;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "company_website" text;--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_removed_by_users_id_fk" FOREIGN KEY ("removed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;