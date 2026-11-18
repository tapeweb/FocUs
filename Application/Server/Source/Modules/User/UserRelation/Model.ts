import { t, type UnwrapSchema } from "elysia";

export const UserResponseBody = t.Object({
  Username: t.String(),
  Email: t.String(),
  CreatedAt: t.String(),
});

export const UpdateQuery = t.Object({
  Id: t.Number(),
});

export const UpdateBody = t.Object({
  Data: t.Partial(
    t.Object({
      Username: t.String(),
      Email: t.String(),
    }),
  ),
});

export const UpdateSchema = t.Object({
  Query: UpdateQuery,
  Body: UpdateBody,
});

export const BearerAuth = t.Object({
  authorization: t.String(),
});

export const UserRelationModel = {
  SelectById: t.Object({
    Id: t.Number(),
  }),

  SelectByUsername: t.Object({
    Username: t.String(),
  }),

  SelectByEmail: t.Object({
    Email: t.String(),
  }),

  Update: UpdateSchema,

  Delete: t.Object({
    Id: t.Number(),
  }),

  UserResponse: UserResponseBody,

  BearerAuth,
};

export type UserRelationModel = {
  [key in keyof typeof UserRelationModel]: UnwrapSchema<
    (typeof UserRelationModel)[key]
  >;
};
