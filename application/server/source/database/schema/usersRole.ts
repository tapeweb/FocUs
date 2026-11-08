import { integer, pgTable, type AnyPgColumn } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { rolesTable } from "./roles";
import * as table from "drizzle-orm/pg-core";

export const usersRole = pgTable("usersRole", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references((): AnyPgColumn => usersTable.id),
  roleId: integer()
    .notNull()
    .references((): AnyPgColumn => rolesTable.id),
});
