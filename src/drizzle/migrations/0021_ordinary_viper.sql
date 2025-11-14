CREATE TABLE "enquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"comment" text,
	"enquireType" varchar(50),
	"senderUserId" varchar(50),
	"receiverUserId" varchar(50),
	"createdAt" timestamp DEFAULT now()
);
