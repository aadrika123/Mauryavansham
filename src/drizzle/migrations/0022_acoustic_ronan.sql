CREATE TABLE "ad_placements" (
	"id" serial PRIMARY KEY NOT NULL,
	"page_name" varchar(100) NOT NULL,
	"section_name" varchar(100) NOT NULL,
	"description" text DEFAULT ''
);
