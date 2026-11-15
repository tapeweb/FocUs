import { database, type DatabaseClient } from "@/config/database";
import type { DeletedTaskModel } from "./model";
import { sessionTokensTable } from "@/database/schema/sessionTokens";
import { eq } from "drizzle-orm";
import { status } from "elysia";
import { usersTable } from "@/database/schema/users";
import { deletedTasks } from "@/database/schema/deletedTasks";

export abstract class DeletedTask {
  static async selectById(
    token: string,
    { id }: DeletedTaskModel["selectById"],
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

    const [existingDeletedTask] = await client
      .select()
      .from(deletedTasks)
      .where(eq(deletedTasks.id, id));

    return existingDeletedTask;
  }

  static async selectByUserId(
    token: string,
    { userId }: DeletedTaskModel["selectByUserId"],
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

    const [existingDeletedTasks] = await client
      .select()
      .from(deletedTasks)
      .where(eq(deletedTasks.userId, userId));

    if (!existingDeletedTasks) return status(404, "Not Found");

    return existingDeletedTasks;
  }
}
