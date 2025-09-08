CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"image" varchar(500),
	"date" date NOT NULL,
	"time" time NOT NULL,
	"location" varchar(255) NOT NULL,
	"attendees" integer DEFAULT 0,
	"max_attendees" integer NOT NULL,
	"organizer" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"category" varchar(100),
	"is_featured" boolean DEFAULT false
);
