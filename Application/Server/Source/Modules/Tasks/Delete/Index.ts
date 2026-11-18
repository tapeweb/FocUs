import Elysia from "elysia";
import { DeleteTaskModel } from "./Model";
import { ExtractToken } from "@/Utils/ExtractToken";
import { DeleteTaskService } from "./Service";

export const DeleteTask = new Elysia({ prefix: "/DeleteTask" }).get(
  "/SelectById",
  async ({ headers, query, status }) => {
    const Token = await ExtractToken(headers.authorization);
    const Response = await DeleteTaskService.SelectById(Token, {
      Id: query.Id,
    });

    if (!Response) return status(403, "Forbidden");

    return Response;
  },
  {
    headers: DeleteTaskModel["BearerAuth"],
    query: DeleteTaskModel["SelectById"],
  },
);
