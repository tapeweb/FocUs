import { t, type UnwrapSchema } from "elysia";

const userPublic = t.Object({
  id: t.Integer({ minimum: 1 }),
  username: t.String({ minLength: 3, maxLength: 64 }),
  email: t.String({ format: "email", minLength: 3, maxLength: 255 }),
});

const bearerAuth = t.Object({
  authorization: t.String(),
});

export const UserModel = {
  create: t.Object({
    username: t.String({ minLength: 3, maxLength: 64 }),
    email: t.String({ format: "email", minLength: 3, maxLength: 255 }),
    password: t.String({ minLength: 8, maxLength: 255 }),
  }),

  selectById: t.Object({
    id: t.Integer({ minimum: 1 }),
  }),

  selectByUsername: t.Object({
    username: t.String({ minLength: 3, maxLength: 64 }),
  }),

  selectByEmail: t.Object({
    email: t.String({ minLength: 3, maxLength: 255 }),
  }),

  update: t.Object({
    data: t.Partial(
      t.Object({
        username: t.String({ minLength: 3, maxLength: 64 }),
        email: t.String({ format: "email", minLength: 3, maxLength: 255 }),
        password: t.String({ minLength: 8, maxLength: 255 }),
      }),
    ),
  }),

  delete: t.Object({
    token: t.String(),
  }),

  userResponse: userPublic,

  bearerAuth,
};

export type UserModel = {
  [k in keyof typeof UserModel]: UnwrapSchema<(typeof UserModel)[k]>;
};
