import { integer, pgTable } from "drizzle-orm/pg-core";
import { UsersTable } from "./Users";
import { RolesTable } from "@/Database/Schema/Database Table/Roles";

export const UsersRoleTable = pgTable("UsersRole", {
  Id: integer().primaryKey().generatedAlwaysAsIdentity(),
  UserId: integer()
    .notNull()
    .references(() => UsersTable.Id, {
      onDelete: "cascade",
    })
    .unique(),
  RoleId: integer()
    .notNull()
    .references(() => RolesTable.Id),
});
