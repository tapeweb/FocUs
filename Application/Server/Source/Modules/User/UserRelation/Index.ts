import Elysia, { status } from "elysia";
import { UpdateBody, UpdateQuery, UserRelationModel } from "./Model";
import { ExtractToken } from "@/Utils/ExtractToken";
import { UserRelationService } from "./Service";

export const UserRelation = new Elysia({ prefix: "/UserRelation" })
  .get(
    "/SelectById",
    async ({ headers, query, status }) => {
      const Token = await ExtractToken(headers.authorization);
      const Response = await UserRelationService.SelectById(Token, {
        Id: query.Id,
      });

      if (!Response) return status(403, "Forbidden");

      return Response;
    },
    {
      headers: UserRelationModel["BearerAuth"],
      query: UserRelationModel["SelectById"],
      status: UserRelationModel["UserResponse"],
    },
  )
  .get(
    "/SelectByUsername",
    async ({ headers, query, status }) => {
      const Token = await ExtractToken(headers.authorization);
      const Response = await UserRelationService.SelectByUsername(Token, {
        Username: query.Username,
      });

      if (!Response) return status(403, "Forbidden");

      return Response;
    },
    {
      headers: UserRelationModel["BearerAuth"],
      query: UserRelationModel["SelectByUsername"],
      status: UserRelationModel["UserResponse"],
    },
  )
  .patch(
    "/Update",
    async ({ headers, query, body }) => {
      const Token = await ExtractToken(headers.authorization);
      await UserRelationService.Update(Token, {
        Query: {
          Id: query.Id,
        },
        Body: {
          Data: {
            Username: body.Data.Username,
            Email: body.Data.Email,
          },
        },
      });
    },
    {
      headers: UserRelationModel["BearerAuth"],
      query: UpdateQuery,
      body: UpdateBody,
    },
  )
  .delete(
    "/Delete",
    async ({ headers, query }) => {
      const Token = await ExtractToken(headers.authorization);
      await UserRelationService.Delete(Token, {
        Id: query.Id,
      });
    },
    {
      headers: UserRelationModel["BearerAuth"],
      query: UserRelationModel["Delete"],
    },
  );
