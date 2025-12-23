ALTER TABLE "blogs" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "blogs" ALTER COLUMN "author_id" SET DATA TYPE integer;
