import { t, type UnwrapSchema } from "elysia";

export const AuthModel = {
  signUpBodyParams: t.Object({
    username: t.String({ minLength: 3, maxLength: 32 }),
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 8 }),
  }),
  signInBodyParams: t.Object({
    username: t.String({ minLength: 3 }),
    password: t.String({ minLength: 8 }),
  }),

  signResponse: t.Object({
    token: t.String(),
  }),

  signInvalid: t.Object({
    message: t.Literal("Invalid username or password"),
  }),

  signConflict: t.Object({
    message: t.String(),
    conflict: t.Union([
      t.Literal("username"),
      t.Literal("email"),
      t.Literal("both"),
    ]),
  }),
} as const;

export type AuthModel = {
  [k in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[k]>;
};
