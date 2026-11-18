import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { UsersTable } from "@/Database/Schema/UserRelation/Users";

export const DeleteTaskTable = pgTable("DeletedTask", {
  Id: integer().primaryKey().generatedAlwaysAsIdentity(),

  UserId: integer()
    .notNull()
    .references(() => UsersTable.Id, {
      onDelete: "cascade",
    }),

  Title: varchar({ length: 64 }).notNull(),
  Description: text().notNull(),

  ArchivedAt: timestamp("ArchivedAt", {
    mode: "string",
  }).notNull(),

  DeletedAt: timestamp("DeletedAt", {
    mode: "string",
  })
    .notNull()
    .defaultNow(),
});
