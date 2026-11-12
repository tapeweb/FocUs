CREATE TYPE "public"."RolesEnum" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "usersRole" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "usersRole_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"roleId" integer NOT NULL,
	CONSTRAINT "usersRole_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "Users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar(64) NOT NULL,
	"email" varchar(255) NOT NULL,
	"hashedPassword" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "Users_username_unique" UNIQUE("username"),
	CONSTRAINT "Users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "sessionTokens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sessionTokens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"token" varchar(255) NOT NULL,
	CONSTRAINT "sessionTokens_userId_unique" UNIQUE("userId"),
	CONSTRAINT "sessionTokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "Roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"roleName" "RolesEnum" NOT NULL,
	CONSTRAINT "Roles_roleName_unique" UNIQUE("roleName")
);
--> statement-breakpoint
ALTER TABLE "usersRole" ADD CONSTRAINT "usersRole_userId_Users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersRole" ADD CONSTRAINT "usersRole_roleId_Roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."Roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessionTokens" ADD CONSTRAINT "sessionTokens_userId_Users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;