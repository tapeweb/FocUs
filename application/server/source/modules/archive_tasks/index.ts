import Elysia from "elysia";
import { ArchiveTaskModel } from "./model";
import { ArchiveTask } from "./service";
import { extractToken } from "@/utils/extractTokenFromHeaders";

export const archiveTask = new Elysia({ prefix: "/archiveTask" })
  .post(
    "/cerate",
    async ({ headers, body }) => {
      const token = await extractToken(headers.authorization);
      await ArchiveTask.create(token, { id: body.id });
    },
    {
      headers: ArchiveTaskModel["bearerAuth"],
      body: ArchiveTaskModel["create"],
    },
  )
  .get(
    "/selectById",
    async ({ headers, query, status }) => {
      const token = await extractToken(headers.authorization);
      const response = await ArchiveTask.selectById(token, {
        id: Number(query.id),
      });

      if (!response) return status(404, "Not Found");
      return response;
    },
    {
      headers: ArchiveTaskModel["bearerAuth"],
      query: ArchiveTaskModel["selectById"],
    },
  )
  .get(
    "/selectByUserId",
    async ({ headers, query, status }) => {
      const token = await extractToken(headers.authorization);
      const response = await ArchiveTask.selectByUserId(token, {
        userId: Number(query.userId),
      });

      if (!response) return status(404, "Not Found");
      return response;
    },
    {
      headers: ArchiveTaskModel["bearerAuth"],
      body: ArchiveTaskModel["create"],
    },
  )
  .patch(
    "/delete",
    async ({ headers, query }) => {
      const token = await extractToken(headers.authorization);
      await ArchiveTask.delete(token, { id: Number(query.id) });
    },
    {
      headers: ArchiveTaskModel["bearerAuth"],
      body: ArchiveTaskModel["delete"],
    },
  )
  .post(
    "/restore",
    async ({ headers, query }) => {
      const token = await extractToken(headers.authorization);
      await ArchiveTask.delete(token, { id: Number(query.id) });
    },
    {
      headers: ArchiveTaskModel["bearerAuth"],
      body: ArchiveTaskModel["restore"],
    },
  );
