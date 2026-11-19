import { t, type UnwrapSchema } from "elysia";

export const AuthModel = {
  SignUpBody: t.Object({
    Username: t.String({ minLength: 6, maxLength: 64 }),
    Email: t.String({ minLength: 3, maxLength: 255 }),
    Password: t.String({ minLength: 8, maxLength: 64 }),
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
