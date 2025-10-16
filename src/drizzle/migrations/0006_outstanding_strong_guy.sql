ALTER TABLE "events" ADD COLUMN "created_at" date DEFAULT now();--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "updated_at" date DEFAULT now();