import {
  integer,
  pgTable,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const sessionTokensTable = pgTable("sessionTokens", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references((): AnyPgColumn => usersTable.id)
    .unique(),
  token: varchar({ length: 255 }).notNull().unique(),
});
