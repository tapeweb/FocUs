import { t, type UnwrapSchema } from "elysia";

const ActiveTaskResponse = t.Object({
  id: t.Number(),
  userId: t.Number(),
  title: t.String(),
  description: t.String(),
  createdAt: t.String(),
});

const bearerAuth = t.Object({
  authorization: t.String(),
});

export const ActiveTaskModel = {
  create: t.Object({
    title: t.String({ minLength: 3, maxLength: 64 }),
    description: t.String(),
  }),

  selectById: t.Object({
    id: t.Number(),
  }),

  selectByUserId: t.Object({
    userId: t.Number(),
  }),

  update: t.Object({
    id: t.Number(),
    data: t.Partial(
      t.Object({
        title: t.String(),
        description: t.String(),
      }),
    ),
  }),

  delete: t.Object({
    id: t.Number(),
  }),

  taskResponse: ActiveTaskResponse,
  tasksResponse: t.Array(ActiveTaskResponse),

  bearerAuth,
};

export type ActiveTaskModel = {
  [k in keyof typeof ActiveTaskModel]: UnwrapSchema<
    (typeof ActiveTaskModel)[k]
  >;
};
