import { database, type DatabaseClient } from "@/config/database";
import type { RoleModel } from "./model";
import { rolesTable } from "@/database/schema/roles";
import { eq } from "drizzle-orm";

export abstract class Role {
  static async selectById(
    { id }: RoleModel["selectByIdParams"],
    client: DatabaseClient = database,
  ): Promise<RoleModel["roleResponse"] | undefined> {
    const [role] = await client
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.id, id))
      .limit(1);

    return role;
  }

  static async selectByRoleName(
    { roleName }: RoleModel["selectByRoleNameParams"],
    client: DatabaseClient = database,
  ): Promise<RoleModel["roleResponse"] | undefined> {
    const [role] = await client
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.roleName, roleName))
      .limit(1);

    return role;
  }
}
