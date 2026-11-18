import { Database, type DatabaseClient } from "@/Config/Database";
import type { AuthModel } from "./Model";
import { UsersTable } from "@/Database/Schema/UserRelation/Users";
import { and, eq, or } from "drizzle-orm";
import { status } from "elysia";
import { SessionTokensTable } from "@/Database/Schema/UserRelation/SessionTokens";
import { randomUUIDv7 } from "bun";
import { UsersRoleTable } from "@/Database/Schema/UserRelation/UsersRole";
import { RolesTable } from "@/Database/Schema/Database Table/Roles";

export abstract class AuthService {
  static async SignUp(
    { Username, Email, Password }: AuthModel["SignUpBody"],
    Client: DatabaseClient = Database,
  ) {
    return await Client.transaction(async (Transaction) => {
      const [ExistingUser] = await Transaction.select()
        .from(UsersTable)
        .where(
          or(eq(UsersTable.Username, Username), eq(UsersTable.Email, Email)),
        );

      if (ExistingUser) return Transaction.rollback();

      const HashedPassword = await Bun.password.hash(Password);

      const [CreatedUser] = await Transaction.insert(UsersTable)
        .values({ Username, Email, HashedPassword })
        .returning({ Id: UsersTable.Id });

      if (!CreatedUser) return Transaction.rollback();

      const Token = randomUUIDv7();
      await Transaction.insert(SessionTokensTable).values({
        UserId: CreatedUser.Id,
        Token,
      });

      const [ResultUserRole] = await Transaction.select({ id: RolesTable.Id })
        .from(RolesTable)
        .where(eq(RolesTable.RoleName, "user"));

      if (!ResultUserRole) return Transaction.rollback();

      await Transaction.insert(UsersRoleTable).values({
        UserId: CreatedUser.Id,
        RoleId: ResultUserRole.id,
      });
      return status(200, Token);
    });
  }

  static async SignIn(
    { Username, Password }: AuthModel["SignInBody"],
    Client: DatabaseClient = Database,
  ) {
    return await Client.transaction(async (Transaction) => {
      const [ExistingUser] = await Transaction.select({
        Id: UsersTable.Id,
        HashedPassword: UsersTable.HashedPassword,
      })
        .from(UsersTable)
        .where(and(eq(UsersTable.Username, Username)));

      if (!ExistingUser) return Transaction.rollback();

      const MatchHashedUserPassword = await Bun.password.verify(
        Password,
        ExistingUser.HashedPassword,
      );

      if (!MatchHashedUserPassword) return Transaction.rollback();

      const [ExistingToken] = await Transaction.select({
        Token: SessionTokensTable.Token,
      })
        .from(SessionTokensTable)
        .where(eq(SessionTokensTable.UserId, ExistingUser.Id));

      if (!ExistingToken) return Transaction.rollback();

      return status(200, ExistingToken.Token);
    });
  }
}
