CREATE TABLE "members" (
	"registration_id" serial PRIMARY KEY NOT NULL,
	"family_head_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"gotra" varchar(100),
	"address" text,
	"city" varchar(100),
	"state" varchar(100),
	"country" varchar(255) DEFAULT 'India',
	"occupation" varchar(100),
	"business_name" varchar(100),
	"family_members" integer DEFAULT 0,
	"agree_to_terms" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"roles" varchar(50) DEFAULT 'member',
	CONSTRAINT "members_email_unique" UNIQUE("email"),
	CONSTRAINT "members_phone_unique" UNIQUE("phone")
);
