import Elysia from "elysia";
import { Role } from "./service";
import { RoleModel } from "./model";

export const roles = new Elysia({ prefix: "/roles" })
  .get(
    "/selectById",
    async ({ query, status }) => {
      const response = await Role.selectById(query);

      if (!response) return status(404, { message: "Role not found." });

      return response;
    },
    {
      query: RoleModel.selectByIdParams,
      response: { 200: RoleModel.roleResponse, 404: RoleModel.errorResponse },
    },
  )
  .get(
    "/selectByRoleName",
    async ({ query, status }) => {
      const response = await Role.selectByRoleName(query);

      if (!response) return status(404, { message: "Role not found." });
      return response;
    },
    {
      query: RoleModel.selectByRoleNameParams,
      response: { 200: RoleModel.roleResponse, 404: RoleModel.errorResponse },
    },
  );
