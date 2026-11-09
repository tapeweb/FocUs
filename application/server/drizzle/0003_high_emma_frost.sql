CREATE TABLE "sessionTokens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sessionTokens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"token" varchar(255) NOT NULL,
	CONSTRAINT "sessionTokens_userId_unique" UNIQUE("userId"),
	CONSTRAINT "sessionTokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "Users" DROP CONSTRAINT "Users_hashedPassword_unique";--> statement-breakpoint
ALTER TABLE "sessionTokens" ADD CONSTRAINT "sessionTokens_userId_Users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersRole" ADD CONSTRAINT "usersRole_userId_unique" UNIQUE("userId");