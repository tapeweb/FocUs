import Elysia, { t } from "elysia";
import { User } from "./service";
import { UserModel } from "./model";
import { extractToken } from "@/utils/extractTokenFromHeaders";

export const user = new Elysia({ prefix: "/users" })
  .post(
    "/create",
    async ({ body }) => {
      await User.create(body);
    },
    {
      body: UserModel["create"],
    },
  )
  .get(
    "/selectById",
    async ({ query, status }) => {
      const response = await User.selectById(query);

      if (!response) return status(404, "Not found");
      return response;
    },
    {
      query: UserModel["selectById"],
      response: {
        200: UserModel["userResponse"],
        404: t.String(),
      },
    },
  )
  .get(
    "/selectByUsername",
    async ({ query, status }) => {
      const response = await User.selectByUsername(query);

      if (!response) return status(404, "Not Found");
      return response;
    },
    {
      query: UserModel["selectByUsername"],
      response: {
        200: UserModel["userResponse"],
        404: t.String(),
      },
    },
  )
  .get(
    "/selectByEmail",
    async ({ query, status }) => {
      const response = await User.selectByEmail(query);

      if (!response) return status(404, "Not Found");
      return response;
    },
    {
      query: UserModel["selectByEmail"],
      response: {
        200: UserModel["userResponse"],
        404: t.String(),
      },
    },
  )
  .patch(
    "/update",
    async ({ headers, body }) => {
      const token = await extractToken(headers.authorization);
      return await User.update(token, body.data);
    },
    {
      headers: UserModel["bearerAuth"],
      body: UserModel["update"],
    },
  )
  .delete(
    "/delete",
    async ({ headers }) => {
      const token = await extractToken(headers.authorization);
      return await User.delete(token);
    },
    {
      headers: UserModel["bearerAuth"],
    },
  );
