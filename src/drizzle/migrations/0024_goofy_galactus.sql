CREATE TABLE "blog_reactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"blog_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"comment" text,
	"parent_id" integer,
	"target_type" varchar NOT NULL,
	"is_liked" boolean DEFAULT false,
	"is_disliked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "blog_interactions" CASCADE;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_reaction_index" ON "blog_reactions" USING btree ("blog_id","user_id","target_type","parent_id");
