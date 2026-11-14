import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const activeTasksTable = pgTable("ActiveTasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  title: varchar({ length: 64 }).notNull(),
  description: text().notNull(),
  createdAt: timestamp("createdAt", { mode: "string" }).notNull().defaultNow(),
});
