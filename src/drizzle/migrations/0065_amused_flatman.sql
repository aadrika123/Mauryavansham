CREATE TABLE "connections" (
	"id" serial PRIMARY KEY NOT NULL,
	"user1_id" integer NOT NULL,
	"user2_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
