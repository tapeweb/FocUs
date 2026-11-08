CREATE TABLE "Users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar(64) NOT NULL,
	"email" varchar(255) NOT NULL,
	"hashedPassword" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "Users_username_unique" UNIQUE("username"),
	CONSTRAINT "Users_email_unique" UNIQUE("email"),
	CONSTRAINT "Users_hashedPassword_unique" UNIQUE("hashedPassword")
);
