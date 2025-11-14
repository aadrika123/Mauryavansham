CREATE TABLE "query_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_id" varchar(50) NOT NULL,
	"receiver_id" varchar(50) NOT NULL,
	"text" text NOT NULL,
	"query_type" varchar(50) DEFAULT 'general' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
