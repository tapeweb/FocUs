import {
  date,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("Users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 64 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  hashedPassword: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
});
