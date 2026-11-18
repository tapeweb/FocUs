import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { UsersTable } from "./Users";

export const SessionTokensTable = pgTable("SessionTokens", {
  Id: integer().primaryKey().generatedAlwaysAsIdentity(),
  UserId: integer()
    .notNull()
    .references(() => UsersTable.Id, {
      onDelete: "cascade",
    })
    .unique(),
  Token: varchar({ length: 255 }).notNull().unique(),
});
