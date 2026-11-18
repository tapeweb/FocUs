import { t, type UnwrapSchema } from "elysia";

export const AuthModel = {
  SignUpBody: t.Object({
    Username: t.String(),
    Email: t.String(),
    Password: t.String(),
  }),

  SignInBody: t.Object({
    Username: t.String(),
    Password: t.String(),
  }),

  SignResponse: t.Object({
    Token: t.String(),
  }),
};

export type AuthModel = {
  [key in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[key]>;
};
