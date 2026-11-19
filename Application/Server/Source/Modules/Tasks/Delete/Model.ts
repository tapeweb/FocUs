import { t, type UnwrapSchema } from "elysia";

export const TaskResponseSchema = t.Object({
  Id: t.Number(),
  UserId: t.Number(),
  Title: t.String(),
  Description: t.String(),
  ArchivedAt: t.String(),
  DeletedAt: t.String(),
});

export const BearerAuth = t.Object({
  authorization: t.String(),
});

export const DeleteTaskModel = {
  SelectById: t.Object({
    Id: t.Number(),
  }),

  BearerAuth,

  TaskResponse: TaskResponseSchema,
};

export type DeleteTaskModel = {
  [key in keyof typeof DeleteTaskModel]: UnwrapSchema<
    (typeof DeleteTaskModel)[key]
  >;
};
