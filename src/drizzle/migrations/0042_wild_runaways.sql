ALTER TABLE "events" ADD COLUMN "from_time" time NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "to_time" time NOT NULL;--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "time";
