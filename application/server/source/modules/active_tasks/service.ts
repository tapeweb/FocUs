import { database, type DatabaseClient } from "@/config/database";
import type { ActiveTaskModel } from "./model";
import { sessionTokensTable } from "@/database/schema/sessionTokens";
import { count, eq } from "drizzle-orm";
import { status } from "elysia";
import { usersTable } from "@/database/schema/users";
import { activeTasksTable } from "@/database/schema/activeTasks";

export abstract class ActiveTask {
  static async create(
    token: string,
    { title, description }: ActiveTaskModel["create"],
    client: DatabaseClient = database,
  ) {
    const [existingToken] = await client
      .select({ userId: sessionTokensTable.userId })
      .from(sessionTokensTable)
      .where(eq(sessionTokensTable.token, token));

    if (!existingToken) return status(404, "Not Found");

    const [existingUser] = await client
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, existingToken.userId));

    if (!existingUser) return status(404, "Not Found");

    const [tasksLimit] = await client
      .select({ count: count() })
      .from(activeTasksTable)
      .where(eq(activeTasksTable.userId, existingUser.id));

    if ((tasksLimit?.count ?? 0) >= 3) return status(403, "Forbidden");

    await client
      .insert(activeTasksTable)
      .values({ userId: existingUser.id, title, description });
  }

  static async selectById(
    token: string,
    { id }: ActiveTaskModel["selectById"],
    client: DatabaseClient = database,
  ) {
    const [existingToken] = await client
      .select({ userId: sessionTokensTable.userId })
      .from(sessionTokensTable)
      .where(eq(sessionTokensTable.token, token));

    if (!existingToken) return status(404, "Not Found");

    const [existingUser] = await client
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, existingToken.userId));

    if (!existingUser) return status(404, "Not Found");

    const [existingTask] = await client
      .select()
      .from(activeTasksTable)
      .where(eq(activeTasksTable.id, id));

    return existingTask;
  }

  static async selectByUserId(
    token: string,
    { userId }: ActiveTaskModel["selectByUserId"],
    client: DatabaseClient = database,
  ) {
    const [existingToken] = await client
      .select({ userId: sessionTokensTable.userId })
      .from(sessionTokensTable)
      .where(eq(sessionTokensTable.token, token));

    if (!existingToken) return status(404, "Not Found");

    const [existingUser] = await client
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, existingToken.userId));

    if (!existingUser) return status(404, "Not Found");

    const [existingTasks] = await client
      .select()
      .from(activeTasksTable)
      .where(eq(activeTasksTable.userId, userId));

    return existingTasks;
  }

  static async update(
    token: string,
    { id, data }: ActiveTaskModel["update"],
    client: DatabaseClient = database,
  ) {
    const [existingToken] = await client
      .select({ userId: sessionTokensTable.userId })
      .from(sessionTokensTable)
      .where(eq(sessionTokensTable.token, token));

    if (!existingToken) return status(404, "Not Found");

    const [existingUser] = await client
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, existingToken.userId));

    if (!existingUser) return status(404, "Not Found");

    await client
      .update(activeTasksTable)
      .set(data)
      .where(eq(activeTasksTable.id, id));
  }

  static async delete(
    token: string,
    { id }: ActiveTaskModel["delete"],
    client: DatabaseClient = database,
  ) {
    const [existingToken] = await client
      .select({ userId: sessionTokensTable.userId })
      .from(sessionTokensTable)
      .where(eq(sessionTokensTable.token, token));

    if (!existingToken) return status(404, "Not Found");

    const [existingUser] = await client
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, existingToken.userId));

    if (!existingUser) return status(404, "Not Found");

    await client.delete(activeTasksTable).where(eq(activeTasksTable.id, id));
  }
}
