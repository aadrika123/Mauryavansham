CREATE TABLE "discussions_reply_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"reply_id" integer NOT NULL,
	"user_id" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "discussions_reply_likes" ADD CONSTRAINT "discussions_reply_likes_reply_id_discussion_replies_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."discussion_replies"("id") ON DELETE no action ON UPDATE no action;