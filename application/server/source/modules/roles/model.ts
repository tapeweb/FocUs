import { rolesEnum } from "@/database/schema/roles";
import { t, type UnwrapSchema } from "elysia";

export const RoleModel = {
  selectByIdParams: t.Object({
    id: t.Number(),
  }),
  selectByRoleNameParams: t.Object({
    roleName: t.UnionEnum(rolesEnum.enumValues),
  }),

  roleResponse: t.Object({
    id: t.Number(),
    roleName: t.UnionEnum(rolesEnum.enumValues),
  }),
  errorResponse: t.Object({
    message: t.String(),
  }),
} as const;

export type RoleModel = {
  [K in keyof typeof RoleModel]: UnwrapSchema<(typeof RoleModel)[K]>;
};
