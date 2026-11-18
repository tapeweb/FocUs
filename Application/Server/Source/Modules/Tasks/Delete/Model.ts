import { t, type UnwrapSchema } from "elysia";

export const BearerAuth = t.Object({
  authorization: t.String(),
});

export const DeleteTaskModel = {
  SelectById: t.Object({
    Id: t.Number(),
  }),

  BearerAuth,
};

export type DeleteTaskModel = {
  [key in keyof typeof DeleteTaskModel]: UnwrapSchema<
    (typeof DeleteTaskModel)[key]
  >;
};
