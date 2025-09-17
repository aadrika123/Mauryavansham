CREATE TABLE "profile_interests" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" varchar(255) NOT NULL,
	"receiver_id" varchar(255) NOT NULL,
	"sender_profile" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
