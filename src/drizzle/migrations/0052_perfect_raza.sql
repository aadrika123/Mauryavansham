ALTER TABLE "businesses" ALTER COLUMN "date_of_establishment" SET DEFAULT 'null';--> statement-breakpoint
ALTER TABLE "businesses" ALTER COLUMN "date_of_establishment" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_active_at" timestamp;
