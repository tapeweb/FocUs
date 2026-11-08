CREATE TABLE "usersRole" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "usersRole_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"roleId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "usersRole" ADD CONSTRAINT "usersRole_userId_Users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersRole" ADD CONSTRAINT "usersRole_roleId_Roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "public"."Roles"("id") ON DELETE no action ON UPDATE no action;