import {
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { UsersTable } from "@/Database/Schema/UserRelation/Users";

export const ActiveTaskTable = pgTable("ActiveTask", {
  Id: integer().primaryKey().generatedAlwaysAsIdentity(),

  UserId: integer()
    .notNull()
    .references(() => UsersTable.Id, {
      onDelete: "cascade",
    }),

  Title: varchar({ length: 64 }).notNull(),
  Description: text().notNull(),

  CreatedAt: timestamp("CreatedAt", {
    mode: "string",
  })
    .notNull()
    .defaultNow(),
});
