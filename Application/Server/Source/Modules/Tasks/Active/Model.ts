import { t, type UnwrapSchema } from "elysia";

export const CreateBody = t.Object({
  Title: t.String(),
  Description: t.String(),
});

const TaskResponseSchema = t.Object({
  Id: t.Number(),
  UserId: t.Number(),
  Title: t.String(),
  Description: t.String(),
  CreatedAt: t.String(),
  ArchivedAt: t.String(),
});

const BearerAuth = t.Object({
  authorization: t.String(),
});

export const ActiveTaskModel = {
  Create: CreateBody,

  SelectById: t.Object({
    Id: t.Number(),
  }),

  SelectByUserId: t.Object({
    UserId: t.Number(),
  }),

  SendToArchive: t.Object({
    Id: t.Number(),
  }),

  taskResponse: TaskResponseSchema,
  tasksResponse: t.Array(TaskResponseSchema),

  BearerAuth,
};

export type ActiveTaskModel = {
  [key in keyof typeof ActiveTaskModel]: UnwrapSchema<
    (typeof ActiveTaskModel)[key]
  >;
};
