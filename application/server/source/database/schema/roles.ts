import { integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("RolesEnum", ["user", "admin"]);

export const rolesTable = pgTable("Roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  roleName: rolesEnum().notNull().unique(),
});
