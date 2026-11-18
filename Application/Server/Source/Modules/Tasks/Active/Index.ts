import Elysia from "elysia";
import { ActiveTaskModel, CreateBody } from "./Model";
import { ExtractToken } from "@/Utils/ExtractToken";
import { ActiveTaskService } from "./Service";

export const ActiveTask = new Elysia({ prefix: "/ActiveTask" })
  .post(
    "/Create",
    async ({ headers, body }) => {
      const Token = await ExtractToken(headers.authorization);
      await ActiveTaskService.Create(Token, {
        Title: body.Title,
        Description: body.Description,
      });
    },
    {
      headers: ActiveTaskModel["BearerAuth"],
      body: ActiveTaskModel["Create"],
    },
  )
  .get(
    "/SelectById",
    async ({ headers, query, status }) => {
      const Token = await ExtractToken(headers.authorization);
      const Response = await ActiveTaskService.SelectById(Token, {
        Id: query.Id,
      });

      if (!Response) return status(403, "Forbidden");
      return Response;
    },
    {
      headers: ActiveTaskModel["BearerAuth"],
      query: ActiveTaskModel["SelectById"],
    },
  )
  .get(
    "/SelectByUserId",
    async ({ headers, query, status }) => {
      const Token = await ExtractToken(headers.authorization);
      const Response = await ActiveTaskService.SelectByUserId(Token, {
        UserId: query.UserId,
      });

      if (!Response) return status(403, "Forbidden");
      return Response;
    },
    {
      headers: ActiveTaskModel["BearerAuth"],
      query: ActiveTaskModel["SelectByUserId"],
    },
  )
  .post(
    "/SendToArchive",
    async ({ headers, query }) => {
      const Token = await ExtractToken(headers.authorization);
      await ActiveTaskService.SendToArchive(Token, {
        Id: query.Id,
      });
    },
    {
      headers: ActiveTaskModel["BearerAuth"],
      query: ActiveTaskModel["SendToArchive"],
    },
  );
