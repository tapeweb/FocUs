import { ExtractToken } from "@/Utils/ExtractToken";
import Elysia from "elysia";
import { ArchiveTaskModel } from "./Model";
import { ArchiveTaskService } from "./Service";

export const ArchiveTask = new Elysia({ prefix: "/ArchiveTask" })
  .get(
    "/SelectById",
    async ({ headers, query, status }) => {
      const Token = await ExtractToken(headers.authorization);
      const Response = await ArchiveTaskService.SelectById(Token, {
        Id: query.Id,
      });

      if (!Response) return status(403, "Forbidden");

      return Response;
    },
    {
      headers: ArchiveTaskModel["BearerAuth"],
      query: ArchiveTaskModel["SelectById"],
      status: ArchiveTaskModel["TaskResponse"],
    },
  )
  .get(
    "/SelectByUserId",
    async ({ headers, query, status }) => {
      const Token = await ExtractToken(headers.authorization);
      const Response = await ArchiveTaskService.SelectByUserId(Token, {
        UserId: query.UserId,
      });

      if (!Response) return status(403, "Forbidden");

      return Response;
    },
    {
      headers: ArchiveTaskModel["BearerAuth"],
      query: ArchiveTaskModel["SelectByUserId"],
      status: ArchiveTaskModel["TasksResponse"],
    },
  )
  .post(
    "/Restore",
    async ({ headers, query }) => {
      const Token = await ExtractToken(headers.authorization);
      await ArchiveTaskService.Restore(Token, {
        Id: query.Id,
      });
    },
    {
      headers: ArchiveTaskModel["BearerAuth"],
      query: ArchiveTaskModel["Restore"],
    },
  )
  .delete(
    "/Delete",
    async ({ headers, query }) => {
      const Token = await ExtractToken(headers.authorization);
      await ArchiveTaskService.Delete(Token, {
        Id: query.Id,
      });
    },
    {
      headers: ArchiveTaskModel["BearerAuth"],
      query: ArchiveTaskModel["Delete"],
    },
  );
