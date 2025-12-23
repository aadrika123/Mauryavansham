ALTER TABLE "notification_reads" ALTER COLUMN "notification_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "notification_reads" ALTER COLUMN "mark_all_read" DROP NOT NULL;
