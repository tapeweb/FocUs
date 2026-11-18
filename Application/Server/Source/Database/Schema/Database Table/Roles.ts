import { integer, pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";

export const RolesEnum = pgEnum("RolesEnum", ["user", "admin"]);

export const RolesTable = pgTable("Roles", {
  Id: integer().primaryKey().generatedAlwaysAsIdentity(),
  RoleName: RolesEnum().notNull().unique(),
});
