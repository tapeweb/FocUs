import { status } from "elysia";

import { AuthModel } from "./model";
import { database, type DatabaseClient } from "@/config/database";
import { usersTable } from "@/database/schema/users";
import { eq, or } from "drizzle-orm";
import { sessionTokensTable } from "@/database/schema/sessionTokens";
import { generateSessionToken } from "@/utils/generateSessionToken";
import { usersRoleTable } from "@/database/schema/usersRole";
import { rolesTable } from "@/database/schema/roles";

export abstract class Auth {
  static async signUp(
    { username, email, password }: AuthModel["signUpBodyParams"],
    client: DatabaseClient = database,
  ) {
    const [existingUser] = await client
      .select()
      .from(usersTable)
      .where(
        or(eq(usersTable.username, username), eq(usersTable.email, email)),
      );
    if (existingUser) {
      const conflict =
        existingUser.username === username && existingUser.email === email
          ? "both"
          : existingUser.username === username
            ? "username"
            : "email";
      throw status(400, {
        message: `User with this ${conflict} already exists.`,
        conflict,
      } satisfies AuthModel["signConflict"]);
    }

    const hashedPassword = await Bun.password.hash(password);
    const token = Bun.randomUUIDv7();
    await client.transaction(async (transaction) => {
      const [user] = await transaction
        .insert(usersTable)
        .values({ username, email, hashedPassword })
        .returning({ id: usersTable.id });
      if (!user) throw new Error("insert returned no row");
      await transaction
        .insert(sessionTokensTable)
        .values({ userId: user.id, token })
        .returning({ token: sessionTokensTable.token });
      const [role] = await transaction
        .select({ id: rolesTable.id })
        .from(rolesTable)
        .where(eq(rolesTable.roleName, "user"));
      if (!role) throw new Error("select returned no row");
      await transaction
        .insert(usersRoleTable)
        .values({ userId: user.id, roleId: role.id });
    });
    return { token } satisfies AuthModel["signResponse"];
  }

  static async signIn(
    { username, password }: AuthModel["signInBodyParams"],
    client: DatabaseClient = database,
  ) {
    const [existingUser] = await client
      .select({ id: usersTable.id, password: usersTable.hashedPassword })
      .from(usersTable)
      .where(eq(usersTable.username, username));

    if (!existingUser)
      return status(404, {
        message: "Invalid username or password",
      } satisfies AuthModel["signInvalid"]);

    if (!Bun.password.verify(password, existingUser.password))
      return status(404, {
        message: "Invalid username or password",
      } satisfies AuthModel["signInvalid"]);

    const [sessionToken] = await client
      .select()
      .from(sessionTokensTable)
      .where(eq(sessionTokensTable.userId, existingUser.id));
    return {
      token: sessionToken,
    };
  }
}
