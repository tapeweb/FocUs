CREATE TYPE "public"."RolesEnum" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "Roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"roleName" "RolesEnum" NOT NULL,
	CONSTRAINT "Roles_roleName_unique" UNIQUE("roleName")
);
