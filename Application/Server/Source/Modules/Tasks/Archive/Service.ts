import { Database, type DatabaseClient } from "@/Config/Database";
import { ArchiveTaskModel } from "./Model";
import { SessionTokensTable } from "@/Database/Schema/UserRelation/SessionTokens";
import { and, count, eq, getTableColumns } from "drizzle-orm";
import { status } from "elysia";
import { UsersTable } from "@/Database/Schema/UserRelation/Users";
import { ArchiveTaskTable } from "@/Database/Schema/Tasks/ArchiveTask";
import { ActiveTaskTable } from "@/Database/Schema/Tasks/ActiveTask";
import { DeleteTaskTable } from "@/Database/Schema/Tasks/DeleteTask";

export abstract class ArchiveTaskService {
  static async SelectById(
    Token: string,
    { Id }: ArchiveTaskModel["SelectById"],
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

    const [ExistingTask] = await Client.select()
      .from(ArchiveTaskTable)
      .where(
        and(
          eq(ArchiveTaskTable.Id, Id),
          eq(ArchiveTaskTable.UserId, ExistingUser.Id),
        ),
      );

    if (!ExistingTask) return status(404, "Not Found");

    return status(200, ExistingTask);
  }

  static async SelectByUserId(
    Token: string,
    { UserId }: ArchiveTaskModel["SelectByUserId"],
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

    const ExistingTasks = await Client.select()
      .from(ArchiveTaskTable)
      .where(
        and(
          eq(ArchiveTaskTable.UserId, UserId),
          eq(ArchiveTaskTable.UserId, ExistingUser.Id),
        ),
      );

    return status(200, ExistingTasks);
  }

  static async Restore(
    Token: string,
    { Id }: ArchiveTaskModel["Restore"],
    Client: DatabaseClient = Database,
  ) {
    const [ExistingToken] = await Client.select({
      UserId: SessionTokensTable.UserId,
    })
      .from(SessionTokensTable)
      .where(eq(SessionTokensTable.Token, Token));

    if (!ExistingToken) return status(401, "Unauthorized");

    await Client.transaction(async (Transaction) => {
      const [ExistingUser] = await Transaction.select()
        .from(UsersTable)
        .where(eq(UsersTable.Id, ExistingToken.UserId))
        .for("update");

      if (!ExistingUser) return Transaction.rollback();

      const [ExistingTask] = await Transaction.select()
        .from(ArchiveTaskTable)
        .where(
          and(
            eq(ArchiveTaskTable.Id, Id),
            eq(ArchiveTaskTable.UserId, ExistingUser.Id),
          ),
        )
        .for("update");

      if (!ExistingTask) return Transaction.rollback();

      const [ExistingActiveTasks] = await Transaction.select({
        Count: count(),
      })
        .from(ActiveTaskTable)
        .where(eq(ActiveTaskTable.UserId, ExistingUser.Id));

      if (!ExistingActiveTasks) return Transaction.rollback();

      if (ExistingActiveTasks.Count >= 3) return Transaction.rollback();

      await Transaction.insert(ActiveTaskTable)
        .values({
          UserId: ExistingTask.UserId,
          Title: ExistingTask.Title,
          Description: ExistingTask.Description,
          CreatedAt: ExistingTask.CreatedAt,
        })
        .returning();

      await Transaction.delete(ArchiveTaskTable).where(
        eq(ArchiveTaskTable.Id, Id),
      );
    });
  }

  static async Delete(
    Token: string,
    { Id }: ArchiveTaskModel["Delete"],
    Client: DatabaseClient = Database,
  ) {
    await Client.transaction(async (Transaction) => {
      const [ExistingToken] = await Transaction.select({
        UserId: SessionTokensTable.UserId,
      })
        .from(SessionTokensTable)
        .where(eq(SessionTokensTable.Token, Token));

      if (!ExistingToken) return;

      const [ExistingUser] = await Transaction.select()
        .from(UsersTable)
        .where(eq(UsersTable.Id, ExistingToken.UserId))
        .for("update");

      if (!ExistingUser) return;

      const [ExistingTask] = await Transaction.select()
        .from(ArchiveTaskTable)
        .where(
          and(
            eq(ArchiveTaskTable.Id, Id),
            eq(ArchiveTaskTable.UserId, ExistingUser.Id),
          ),
        )
        .for("update");

      if (!ExistingTask) return;

      await Transaction.insert(DeleteTaskTable)
        .values({
          UserId: ExistingTask.UserId,
          Title: ExistingTask.Title,
          Description: ExistingTask.Description,
          ArchivedAt: ExistingTask.ArchivedAt,
        })
        .returning();

      await Transaction.delete(ArchiveTaskTable).where(
        and(
          eq(ArchiveTaskTable.Id, Id),
          eq(ArchiveTaskTable.UserId, ExistingUser.Id),
        ),
      );
    });
  }
}
