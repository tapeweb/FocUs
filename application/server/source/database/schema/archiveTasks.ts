import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const archiveTasksTable = pgTable("ArchiveTasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  title: varchar({ length: 64 }).notNull(),
  description: text().notNull(),
  createdAt: timestamp("createdAt", { mode: "string" }).notNull(),
  archivedAt: timestamp("archivedAt", { mode: "string" })
    .notNull()
    .defaultNow(),
});
