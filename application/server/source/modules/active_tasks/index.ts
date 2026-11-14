import Elysia from "elysia";
import { ActiveTaskModel } from "./model";
import { extractToken } from "@/utils/extractTokenFromHeaders";
import { ActiveTask } from "./service";

export const activeTask = new Elysia({ prefix: "/activeTask" })
  .post(
    "/create",
    async ({ headers, body }) => {
      const token = await extractToken(headers.authorization);
      await ActiveTask.create(token, {
        title: body.title,
        description: body.description,
      });
    },
    {
      headers: ActiveTaskModel["bearerAuth"],
      body: ActiveTaskModel["create"],
    },
  )
  .get(
    "/selectById",
    async ({ headers, query, status }) => {
      const token = await extractToken(headers.authorization);
      const response = await ActiveTask.selectById(token, {
        id: Number(query.id),
      });

      if (!response) return status(404, "Not Found");
      return response;
    },
    {
      headers: ActiveTaskModel["bearerAuth"],
      body: ActiveTaskModel["selectById"],
    },
  )
  .get(
    "/selectByUserId",
    async ({ headers, query, status }) => {
      const token = await extractToken(headers.authorization);
      const response = await ActiveTask.selectByUserId(token, {
        userId: Number(query.userId),
      });

      if (!response) return status(404, "Not Found");
      return response;
    },
    {
      headers: ActiveTaskModel["bearerAuth"],
      body: ActiveTaskModel["selectByUserId"],
    },
  )
  .patch(
    "/update",
    async ({ headers, query, body }) => {
      const token = await extractToken(headers.authorization);
      await ActiveTask.update(token, { id: Number(query.id), data: body.data });
    },
    {
      headers: ActiveTaskModel["bearerAuth"],
      query: ActiveTaskModel["update"],
      body: ActiveTaskModel["update"],
    },
  )
  .delete(
    "/delete",
    async ({ headers, query }) => {
      const token = await extractToken(headers.authorization);
      await ActiveTask.delete(token, { id: Number(query.id) });
    },
    {
      headers: ActiveTaskModel["bearerAuth"],
      query: ActiveTaskModel["delete"],
    },
  );