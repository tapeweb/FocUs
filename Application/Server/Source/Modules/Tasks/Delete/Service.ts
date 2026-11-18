import { Database, type DatabaseClient } from "@/Config/Database";
import { DeleteTaskModel } from "./Model";
import { SessionTokensTable } from "@/Database/Schema/UserRelation/SessionTokens";
import { and, eq } from "drizzle-orm";
import { status } from "elysia";
import { UsersTable } from "@/Database/Schema/UserRelation/Users";
import { DeleteTaskTable } from "@/Database/Schema/Tasks/DeleteTask";

export abstract class DeleteTaskService {
  static async SelectById(
    Token: string,
    { Id }: DeleteTaskModel["SelectById"],
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
      .where(eq(UsersTable.Id, ExistingToken.UserId));

    if (!ExistingUser) return status(404, "Not Found");

    const [ExistingDeletedTask] = await Client.select()
      .from(DeleteTaskTable)
      .where(
        and(
          eq(DeleteTaskTable.Id, Id),
          eq(DeleteTaskTable.UserId, ExistingUser.Id),
        ),
      );

    if (!ExistingDeletedTask) return status(404, "Not Found");

    return ExistingDeletedTask;
  }
}
