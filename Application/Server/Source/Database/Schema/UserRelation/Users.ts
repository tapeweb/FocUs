import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const UsersTable = pgTable("Users", {
  Id: integer().primaryKey().generatedAlwaysAsIdentity(),
  Username: varchar({ length: 64 }).notNull().unique(),
  Email: varchar({ length: 255 }).notNull().unique(),
  HashedPassword: varchar({ length: 255 }).notNull(),
  CreatedAt: timestamp("CreatedAt", { mode: "string" }).defaultNow(),
});
