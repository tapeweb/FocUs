import {
  database,
  type DatabaseClient,
  type TransactionClient,
} from "@/config/database";
import { rolesTable } from "@/database/schema/roles";
import type {
  IRolesModelSelectByIdBody,
  IRolesModelSelectByRoleNameBody,
} from "@/models/roles";
import { eq } from "drizzle-orm";

class RolesRepository {
  selectById = async (
    { id }: IRolesModelSelectByIdBody,
    client: DatabaseClient,
  ) => {
    const [role] = await client
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.id, id));

    return role ?? null;
  };

  selectByRoleName = async (
    { roleName }: IRolesModelSelectByRoleNameBody,
    client: DatabaseClient,
  ) => {
    const [role] = await client
      .select()
      .from(rolesTable)
      .where(eq(rolesTable.roleName, roleName));
    return role ?? null;
  };
}

export default new RolesRepository();
