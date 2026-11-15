import Elysia from "elysia";
import { DeletedTaskModel } from "./model";
import { extractToken } from "@/utils/extractTokenFromHeaders";
import { DeletedTask } from "./service";

export const deletedTask = new Elysia({ prefix: "/deletedTask" })
  .get(
    "/selectById",
    async ({ headers, query, status }) => {
      const token = await extractToken(headers.authorization);
      const response = await DeletedTask.selectById(token, {
        id: Number(query.id),
      });

      if (!response) return status(404, "Not Found");
      return response;
    },
    {
      headers: DeletedTaskModel["bearerAuth"],
      query: DeletedTaskModel["selectById"],
    },
  )
  .get(
    "/selectByUserId",
    async ({ headers, query, status }) => {
      const token = await extractToken(headers.authorization);
      const response = await DeletedTask.selectByUserId(token, {
        userId: Number(query.userId),
      });

      if (!response) return status(404, "Not Found");
      return response;
    },
    {
      headers: DeletedTaskModel["bearerAuth"],
      query: DeletedTaskModel["selectByUserId"],
    },
  );
