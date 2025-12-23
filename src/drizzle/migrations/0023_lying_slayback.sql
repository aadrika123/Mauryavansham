CREATE TABLE "blog_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"blog_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"comment" text,
	"parent_id" integer,
	"target_type" varchar DEFAULT 'blog',
	"is_liked" boolean DEFAULT false,
	"is_disliked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "blog_interactions" ADD CONSTRAINT "blog_interactions_blog_id_blogs_id_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blogs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_interactions" ADD CONSTRAINT "blog_interactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_interactions" ADD CONSTRAINT "blog_interactions_parent_id_blog_interactions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog_interactions"("id") ON DELETE no action ON UPDATE no action;
