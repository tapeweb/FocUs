import { Database, type DatabaseClient } from "@/Config/Database";
import type { UserRelationModel } from "./Model";
import { UsersTable } from "@/Database/Schema/UserRelation/Users";
import { and, eq } from "drizzle-orm";
import { SessionTokensTable } from "@/Database/Schema/UserRelation/SessionTokens";
import { status } from "elysia";

export abstract class UserRelationService {
  static async SelectById(
    Token: string,
    { Id }: UserRelationModel["SelectById"],
    Client: DatabaseClient = Database,
  ) {
    const [ExistingToken] = await Client.select({
      UserId: SessionTokensTable.UserId,
    })
      .from(SessionTokensTable)
      .where(eq(SessionTokensTable.Token, Token));

    if (!ExistingToken) return status(404, "Not Found");

    const [ExistingUser] = await Client.select()
      .from(UsersTable)
      .where(
        and(eq(UsersTable.Id, ExistingToken.UserId), eq(UsersTable.Id, Id)),
      );

    if (!ExistingUser) return status(404, "Not Found");

    return ExistingUser;
  }

  static async SelectByUsername(
    Token: string,
    { Username }: UserRelationModel["SelectByUsername"],
    Client: DatabaseClient = Database,
  ) {
    const [ExistingToken] = await Client.select({
      UserId: SessionTokensTable.UserId,
    })
      .from(SessionTokensTable)
      .where(eq(SessionTokensTable.Token, Token));

    if (!ExistingToken) return status(404, "Not Found");

    const [ExistingUserByUserId] = await Client.select()
      .from(UsersTable)
      .where(eq(UsersTable.Id, ExistingToken.UserId));

    if (!ExistingUserByUserId) return status(404, "Not Found");

    const [ExistingUser] = await Client.select({
      Id: UsersTable.Id,
      Username: UsersTable.Username,
      Email: UsersTable.Email,
      CreatedAt: UsersTable.CreatedAt,
    })
      .from(UsersTable)
      .where(and(eq(UsersTable.Username, Username), eq(UsersTable.Id, Id)));

    if (!ExistingUser) return status(404, "Not Found");

    return ExistingUser;
  }

  static async SelectByEmail(
    Token: string,
    { Email }: UserRelationModel["SelectByEmail"],
    Client: DatabaseClient = Database,
  ) {
    const [ExistingToken] = await Client.select({
      UserId: SessionTokensTable.UserId,
    })
      .from(SessionTokensTable)
      .where(eq(SessionTokensTable.Token, Token));

    if (!ExistingToken) return status(404, "Not Found");

    const [ExistingUser] = await Client.select({
      Id: UsersTable.Id,
      Username: UsersTable.Username,
      Email: UsersTable.Email,
      CreatedAt: UsersTable.CreatedAt,
    })
      .from(UsersTable)
      .where(
        and(
          eq(UsersTable.Email, Email),
          eq(UsersTable.Id, ExistingToken.UserId),
        ),
      );

    if (!ExistingUser) return status(404, "Not Found");

    return ExistingUser;
  }

  static async Update(
    Token: string,
    { Query, Body }: UserRelationModel["Update"],
    Client: DatabaseClient = Database,
  ) {
    const [ExistingToken] = await Client.select({
      UserId: SessionTokensTable.UserId,
    })
      .from(SessionTokensTable)
      .where(eq(SessionTokensTable.Token, Token));

    if (!ExistingToken) return status(404, "Not Found");

    const [ExistingUser] = await Client.select()
      .from(UsersTable)
      .where(
        and(
          eq(UsersTable.Id, Query.Id),
          eq(UsersTable.Id, ExistingToken.UserId),
        ),
      );

    if (!ExistingUser) return status(404, "Not Found");

    await Client.update(UsersTable)
      .set({
        Username: Body.Data.Username,
        Email: Body.Data.Email,
      })
      .where(eq(UsersTable.Id, ExistingUser.Id))
      .returning();
  }

  static async Delete(
    Token: string,
    { Id }: UserRelationModel["Delete"],
    Client: DatabaseClient = Database,
  ) {
    await Client.transaction(async (Transaction) => {
      const [ExistingToken] = await Transaction.select({
        UserId: SessionTokensTable.UserId,
      })
        .from(SessionTokensTable)
        .where(eq(SessionTokensTable.Token, Token));

      if (!ExistingToken) return Transaction.rollback();

      const [ExistingUser] = await Transaction.select()
        .from(UsersTable)
        .where(
          and(eq(UsersTable.Id, ExistingToken.UserId), eq(UsersTable.Id, Id)),
        );

      if (!ExistingUser) return Transaction.rollback();

      await Transaction.delete(UsersTable).where(
        eq(UsersTable.Id, ExistingUser.Id),
      );
    });
  }
}
