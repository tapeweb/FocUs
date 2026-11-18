import { t, type UnwrapSchema } from "elysia";

const BearerAuth = t.Object({
  authorization: t.String(),
});

const TaskResponseSchema = t.Object({
  Id: t.Number(),
  UserId: t.Number(),
  Title: t.String(),
  Description: t.String(),
  CreatedAt: t.String(),
  ArchivedAt: t.String(),
});

export const ArchiveTaskModel = {
  SelectById: t.Object({
    Id: t.Number(),
  }),

  SelectByUserId: t.Object({
    UserId: t.Number(),
  }),

  Restore: t.Object({
    Id: t.Number(),
  }),

  Delete: t.Object({
    Id: t.Number(),
  }),

  TaskResponse: TaskResponseSchema,
  TasksResponse: t.Array(TaskResponseSchema),

  BearerAuth,
};

export type ArchiveTaskModel = {
  [key in keyof typeof ArchiveTaskModel]: UnwrapSchema<
    (typeof ArchiveTaskModel)[key]
  >;
};
