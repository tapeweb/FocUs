import { integer, pgTable, type AnyPgColumn } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { rolesTable } from "./roles";

export const usersRoleTable = pgTable("usersRole", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id)
    .unique(),
  roleId: integer()
    .notNull()
    .references(() => rolesTable.id),
});
