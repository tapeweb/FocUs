import Elysia, { t } from "elysia";
import { DeleteTaskModel } from "./Model";
import { ExtractToken } from "@/Utils/ExtractToken";
import { DeleteTaskService } from "./Service";

export const DeleteTask = new Elysia({ prefix: "/DeleteTask" }).get(
  "/SelectById",
  async ({ headers, query }) => {
    const Token = await ExtractToken(headers.authorization);
    return await DeleteTaskService.SelectById(Token, {
      Id: query.Id,
    });
  },
  {
    headers: DeleteTaskModel["BearerAuth"],
    query: DeleteTaskModel["SelectById"],
    response: { 200: DeleteTaskModel["TaskResponse"], 404: t.String() },
  },
);
