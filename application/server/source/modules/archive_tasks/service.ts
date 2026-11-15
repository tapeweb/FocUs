import { database, type DatabaseClient } from "@/config/database";
import type { ArchiveTaskModel } from "./model";
import { sessionTokensTable } from "@/database/schema/sessionTokens";
import { count, eq } from "drizzle-orm";
import { status } from "elysia";
import { usersTable } from "@/database/schema/users";
import { activeTasksTable } from "@/database/schema/activeTasks";
import { archiveTasksTable } from "@/database/schema/archiveTasks";

export abstract class ArchiveTask {
  static async selectById(
    token: string,
    { id }: ArchiveTaskModel["selectById"],
    client: DatabaseClient = database,
  ) {
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

    const [existingArchiveTasks] = await client
      .select()
      .from(archiveTasksTable)
      .where(eq(archiveTasksTable.id, id));

    if (!existingArchiveTasks) return status(404, "Not Found");

    return existingArchiveTasks;
  }

  static async selectByUserId(
    token: string,
    { userId }: ArchiveTaskModel["selectByUserId"],
    client: DatabaseClient = database,
  ) {
    const [existingToken] = await client
      .select()
      .from(sessionTokensTable)
      .where(eq(sessionTokensTable.token, token));

    if (!existingToken) return status(404, "Not Found");

    const [existingUser] = await client
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!existingUser) return status(404, "Not Found");

    const [existingArchiveTasks] = await client
      .select()
      .from(archiveTasksTable)
      .where(eq(archiveTasksTable.userId, userId));

    if (!existingArchiveTasks) return status(404, "Not Found");

    return existingArchiveTasks;
  }

  static async sendToDeleted(
    token: string,
    { id }: ArchiveTaskModel["sendToDeleted"],
    client: DatabaseClient = database,
  ) {
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

    const [existingArchiveTasks] = await client
      .select()
      .from(archiveTasksTable)
      .where(eq(archiveTasksTable.id, id));

    if (!existingArchiveTasks) return status(404, "Not Found");

    await client
      .select()
      .from(archiveTasksTable)
      .where(eq(archiveTasksTable.id, id))
      .limit(1);
  }

  static async restore(
    token: string,
    { id }: ArchiveTaskModel["restore"],
    client: DatabaseClient = database,
  ) {
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

    const [existingArchiveTasks] = await client
      .select()
      .from(archiveTasksTable)
      .where(eq(archiveTasksTable.id, id));

    if (!existingArchiveTasks) return status(404, "Not Found");

    const [existingActiveTasks] = await client
      .select({ count: count() })
      .from(activeTasksTable)
      .where(eq(activeTasksTable.userId, existingUser.id));

    if ((existingActiveTasks?.count ?? 0) >= 3) return status(403, "Forbidden");

    await client.transaction(async (transaction) => {
      await transaction.insert(activeTasksTable).values({
        userId: existingArchiveTasks.userId,
        title: existingArchiveTasks.title,
        description: existingArchiveTasks.description,
      });

      await transaction
        .delete(archiveTasksTable)
        .where(eq(archiveTasksTable.id, id));
    });
  }
}
