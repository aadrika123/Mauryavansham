ALTER TABLE "businesses" ALTER COLUMN "date_of_establishment" SET DEFAULT 'null';--> statement-breakpoint
ALTER TABLE "businesses" ALTER COLUMN "date_of_establishment" DROP NOT NULL;