import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const deletedTasks = pgTable("DeletedTasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id),
  title: varchar({ length: 64 }).notNull(),
  description: text().notNull(),
  archivedAt: timestamp("archivedAt", { mode: "string" }).notNull(),
  deletedAt: timestamp("deletedAt", { mode: "string" }).notNull().defaultNow(),
});
