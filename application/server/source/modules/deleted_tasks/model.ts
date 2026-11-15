import { t, type UnwrapSchema } from "elysia";

const DeletedTaskResponse = t.Object({
  id: t.Number(),
  userId: t.Number(),
  title: t.String(),
  description: t.String(),
  archivedAt: t.String(),
  deletedAt: t.String(),
});

const bearerAuth = t.Object({
  authorization: t.String(),
});

export const DeletedTaskModel = {
  selectById: t.Object({
    id: t.Number(),
  }),

  selectByUserId: t.Object({
    userId: t.Number(),
  }),

  taskResponse: DeletedTaskResponse,
  tasksResponse: t.Array(DeletedTaskResponse),

  bearerAuth,
};

export type DeletedTaskModel = {
  [k in keyof typeof DeletedTaskModel]: UnwrapSchema<
    (typeof DeletedTaskModel)[k]
  >;
};
