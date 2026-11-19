import { Database, type DatabaseClient } from "@/Config/Database";
import { ActiveTaskModel } from "./Model";
import { SessionTokensTable } from "@/Database/Schema/UserRelation/SessionTokens";
import { and, count, eq } from "drizzle-orm";
import { status } from "elysia";
import { UsersTable } from "@/Database/Schema/UserRelation/Users";
import { ActiveTaskTable } from "@/Database/Schema/Tasks/ActiveTask";
import { ArchiveTaskTable } from "@/Database/Schema/Tasks/ArchiveTask";

export abstract class ActiveTaskService {
  static async Create(
    Token: string,
    { Title, Description }: ActiveTaskModel["Create"],
    Client: DatabaseClient = Database,
  ) {
    const [ExistingToken] = await Client.select()
      .from(SessionTokensTable)
      .where(eq(SessionTokensTable.Token, Token));

    if (!ExistingToken) return status(401, "Unauthorized");

    await Client.transaction(async (Transaction) => {
      const [ExistingUser] = await Transaction.select()
        .from(UsersTable)
        .where(eq(UsersTable.Id, ExistingToken.UserId))
        .for("update");

      if (!ExistingUser) return Transaction.rollback();

      const [CountableTasks] = await Transaction.select({ Count: count() })
        .from(ActiveTaskTable)
        .where(eq(ActiveTaskTable.UserId, ExistingUser.Id));

      if (!CountableTasks) return true;

      if (CountableTasks.Count >= 3) return Transaction.rollback();

      await Transaction.insert(ActiveTaskTable).values({
        UserId: ExistingUser.Id,
        Title,
        Description,
      });
    });
  }

  static async SelectById(
    Token: string,
    { Id }: ActiveTaskModel["SelectById"],
    Client: DatabaseClient = Database,
  ) {
    const [ExistingToken] = await Client.select()
      .from(SessionTokensTable)
      .where(eq(SessionTokensTable.Token, Token));

    if (!ExistingToken) return status(401, "Unauthorized");

    const [ExistingUser] = await Client.select()
      .from(UsersTable)
      .where(eq(UsersTable.Id, ExistingToken.UserId));

    if (!ExistingUser) return status(404, "Not Found");

    const [ExistingTask] = await Client.select()
      .from(ActiveTaskTable)
      .where(
        and(
          eq(ActiveTaskTable.UserId, ExistingUser.Id),
          eq(ActiveTaskTable.Id, Id),
        ),
      );

    if (!ExistingTask) return status(404, "Not Found");

    return ExistingTask;
  }

  static async SelectByUserId(
    Token: string,
    { UserId }: ActiveTaskModel["SelectByUserId"],
    Client: DatabaseClient = Database,
  ) {
    const [ExistingToken] = await Client.select()
      .from(SessionTokensTable)
      .where(eq(SessionTokensTable.Token, Token));

    if (!ExistingToken) return status(401, "Unauthorized");

    const [ExistingUser] = await Client.select()
      .from(UsersTable)
      .where(eq(UsersTable.Id, ExistingToken.UserId));

    if (!ExistingUser) return status(404, "Not Found");

    const ExistingTasks = await Client.select()
      .from(ActiveTaskTable)
      .where(
        and(
          eq(ActiveTaskTable.UserId, ExistingUser.Id),
          eq(ActiveTaskTable.UserId, UserId),
        ),
      );

    if (!ExistingTasks) return status(404, "Not Found");

    return ExistingTasks;
  }

  static async SendToArchive(
    Token: string,
    { Id }: ActiveTaskModel["SendToArchive"],
    Client: DatabaseClient = Database,
  ) {
    const [ExistingToken] = await Client.select()
      .from(SessionTokensTable)
      .where(eq(SessionTokensTable.Token, Token));

    if (!ExistingToken) return status(401, "Unauthorized");

    const [ExistingUser] = await Client.select()
      .from(UsersTable)
      .where(eq(UsersTable.Id, ExistingToken.UserId));

    if (!ExistingUser) return status(404, "Not Found");

    await Client.transaction(async (Transaction) => {
      const [ExistingTask] = await Transaction.select()
        .from(ActiveTaskTable)
        .where(
          and(
            eq(ActiveTaskTable.UserId, ExistingUser.Id),
            eq(ActiveTaskTable.Id, Id),
          ),
        )
        .for("update");

      if (!ExistingTask) return Transaction.rollback();

      await Transaction.insert(ArchiveTaskTable).values({
        UserId: ExistingTask.UserId,
        Title: ExistingTask.Title,
        Description: ExistingTask.Description,
        CreatedAt: ExistingTask.CreatedAt,
      });

      await Transaction.delete(ActiveTaskTable).where(
        and(
          eq(ActiveTaskTable.UserId, ExistingUser.Id),
          eq(ActiveTaskTable.Id, Id),
        ),
      );
    });
  }
}
