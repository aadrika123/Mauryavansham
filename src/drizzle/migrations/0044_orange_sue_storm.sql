CREATE TABLE "ad_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"rate" numeric NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
