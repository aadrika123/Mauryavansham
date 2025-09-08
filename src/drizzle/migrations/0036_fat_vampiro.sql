CREATE TABLE "user_approvals" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"admin_id" integer NOT NULL,
	"admin_name" varchar(100) NOT NULL,
	"status" varchar(20) DEFAULT 'approved',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_approvals" ADD CONSTRAINT "user_approvals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_approvals" ADD CONSTRAINT "user_approvals_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;