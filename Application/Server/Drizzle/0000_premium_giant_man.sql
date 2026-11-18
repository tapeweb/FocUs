CREATE TYPE "public"."RolesEnum" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "DeletedTask" (
	"Id" integer PRIMARY KEY NOT NULL,
	"UserId" integer NOT NULL,
	"Title" varchar(64) NOT NULL,
	"Description" text NOT NULL,
	"ArchivedAt" timestamp NOT NULL,
	"DeletedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SessionTokens" (
	"Id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "SessionTokens_Id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"UserId" integer NOT NULL,
	"Token" varchar(255) NOT NULL,
	CONSTRAINT "SessionTokens_UserId_unique" UNIQUE("UserId"),
	CONSTRAINT "SessionTokens_Token_unique" UNIQUE("Token")
);
--> statement-breakpoint
CREATE TABLE "UsersRole" (
	"Id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "UsersRole_Id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"UserId" integer NOT NULL,
	"RoleId" integer NOT NULL,
	CONSTRAINT "UsersRole_UserId_unique" UNIQUE("UserId")
);
--> statement-breakpoint
CREATE TABLE "Roles" (
	"Id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Roles_Id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"RoleName" "RolesEnum" NOT NULL,
	CONSTRAINT "Roles_RoleName_unique" UNIQUE("RoleName")
);
--> statement-breakpoint
CREATE TABLE "ArchivedTask" (
	"Id" integer PRIMARY KEY NOT NULL,
	"UserId" integer NOT NULL,
	"Title" varchar(64) NOT NULL,
	"Description" text NOT NULL,
	"CreatedAt" timestamp NOT NULL,
	"ArchivedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ActiveTask" (
	"Id" integer PRIMARY KEY NOT NULL,
	"UserId" integer NOT NULL,
	"Title" varchar(64) NOT NULL,
	"Description" text NOT NULL,
	"CreatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Users" (
	"Id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Users_Id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"Username" varchar(64) NOT NULL,
	"Email" varchar(255) NOT NULL,
	"HashedPassword" varchar(255) NOT NULL,
	"CreatedAt" timestamp DEFAULT now(),
	CONSTRAINT "Users_Username_unique" UNIQUE("Username"),
	CONSTRAINT "Users_Email_unique" UNIQUE("Email")
);
--> statement-breakpoint
ALTER TABLE "DeletedTask" ADD CONSTRAINT "DeletedTask_UserId_Users_Id_fk" FOREIGN KEY ("UserId") REFERENCES "public"."Users"("Id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SessionTokens" ADD CONSTRAINT "SessionTokens_UserId_Users_Id_fk" FOREIGN KEY ("UserId") REFERENCES "public"."Users"("Id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UsersRole" ADD CONSTRAINT "UsersRole_UserId_Users_Id_fk" FOREIGN KEY ("UserId") REFERENCES "public"."Users"("Id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UsersRole" ADD CONSTRAINT "UsersRole_RoleId_Roles_Id_fk" FOREIGN KEY ("RoleId") REFERENCES "public"."Roles"("Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ArchivedTask" ADD CONSTRAINT "ArchivedTask_UserId_Users_Id_fk" FOREIGN KEY ("UserId") REFERENCES "public"."Users"("Id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ActiveTask" ADD CONSTRAINT "ActiveTask_UserId_Users_Id_fk" FOREIGN KEY ("UserId") REFERENCES "public"."Users"("Id") ON DELETE cascade ON UPDATE no action;