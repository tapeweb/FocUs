import { database, type DatabaseClient } from "@/config/database";
import type { UserModel } from "./model";
import { usersTable } from "@/database/schema/users";
import { eq, or } from "drizzle-orm";
import { status } from "elysia";
import { generateSessionToken } from "@/utils/generateSessionToken";
import { sessionTokensTable } from "@/database/schema/sessionTokens";
import { rolesTable } from "@/database/schema/roles";
import { usersRoleTable } from "@/database/schema/usersRole";

export abstract class User {
  static async create(
    { username, email, password }: UserModel["create"],
    client: DatabaseClient = database,
  ) {
    const [existingUser] = await client
      .select()
      .from(usersTable)
      .where(
        or(eq(usersTable.username, username), eq(usersTable.email, email)),
      );

    if (existingUser) return status(409, "Conflict");

    const hashedPassword = await Bun.password.hash(password);
    const token = Bun.randomUUIDv7();

    await client.transaction(async (transaction) => {
      const [user] = await transaction
        .insert(usersTable)
        .values({ username, email, hashedPassword })
        .returning({ id: usersTable.id });

      if (!user) throw status(409, "Conflict");

      await transaction
        .insert(sessionTokensTable)
        .values({ userId: user.id, token })
        .returning({ token: sessionTokensTable.token });

      const [role] = await transaction
        .select({ id: rolesTable.id })
        .from(rolesTable)
        .where(eq(rolesTable.roleName, "user"));

      if (!role) throw status(404, "Not Found");
      await transaction
        .insert(usersRoleTable)
        .values({ userId: user.id, roleId: role.id });
    });
  }

  static async selectById(
    { id }: UserModel["selectById"],
    client: DatabaseClient = database,
  ) {
    const [existingUser] = await client
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!existingUser) return status(404, "Not Found");

    return existingUser;
  }

  static async selectByUsername(
    { username }: UserModel["selectByUsername"],
    client: DatabaseClient = database,
  ) {
    const [existingUser] = await client
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username));

    if (!existingUser) return status(404, "Not Found");

    return existingUser;
  }

  static async selectByEmail(
    { email }: UserModel["selectByEmail"],
    client: DatabaseClient = database,
  ) {
    const [existingUser] = await client
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!existingUser) return status(404, "Not Found");

    return existingUser;
  }

  static async update(
    token: string,
    data: UserModel["update"]["data"],
    client: DatabaseClient = database,
  ) {
    const [existingToken] = await client
      .select()
      .from(sessionTokensTable)
      .where(eq(sessionTokensTable.token, token));

    if (!existingToken) return status(404, "Not Found token");

    const [existingUser] = await client
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, existingToken.userId));

    if (!existingUser) return status(404, "Not Found user");

    await client
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, existingUser.id));
  }

  static async delete(token: string, client: DatabaseClient = database) {
    const [existingToken] = await client
      .select()
      .from(sessionTokensTable)
      .where(eq(sessionTokensTable.token, token));

    if (!existingToken) return status(404, "Not Found");

    const [existingUser] = await client
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, existingToken.userId));

    if (!existingUser) return status(404, "Not Found");

    await client.transaction(async (transaction) => {
      await transaction
        .delete(sessionTokensTable)
        .where(eq(sessionTokensTable.userId, existingUser.id));

      await transaction
        .delete(usersRoleTable)
        .where(eq(usersRoleTable.userId, existingUser.id));

      await transaction
        .delete(usersTable)
        .where(eq(usersTable.id, existingUser.id));
    });
  }
}
