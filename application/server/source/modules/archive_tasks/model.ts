import { t, type UnwrapSchema } from "elysia";

const ArchiveTaskResponse = t.Object({
  id: t.Number(),
  userId: t.Number(),
  title: t.String(),
  description: t.String(),
  createdAt: t.String(),
  archivedAt: t.String(),
});

const bearerAuth = t.Object({
  authorization: t.String(),
});

export const ArchiveTaskModel = {
  selectById: t.Object({
    id: t.Number(),
  }),

  selectByUserId: t.Object({
    userId: t.Number(),
  }),

  sendToDeleted: t.Object({
    id: t.Number(),
  }),

  restore: t.Object({
    id: t.Number(),
  }),

  taskResponse: ArchiveTaskResponse,
  tasksResponse: t.Array(ArchiveTaskResponse),

  bearerAuth,
};

export type ArchiveTaskModel = {
  [k in keyof typeof ArchiveTaskModel]: UnwrapSchema<
    (typeof ArchiveTaskModel)[k]
  >;
};
