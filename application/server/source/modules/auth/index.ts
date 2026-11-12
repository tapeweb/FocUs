import Elysia from "elysia";
import { Auth } from "./service";
import { AuthModel } from "./model";

export const auth = new Elysia({ prefix: "/auth" })
  .post(
    "/signUp",
    async ({ body, status }) => {
      const response = await Auth.signUp(body);

      if (!response) return status(406, "Not Acceptable.");
      return response;
    },
    {
      body: AuthModel.signUpBodyParams,
    },
  )
  .post(
    "/signIn",
    async ({ body, status }) => {
      const response = await Auth.signIn(body);

      if (!response) return status(406, "Not Acceptable");
      return response;
    },
    {
      body: AuthModel.signInBodyParams,
    },
  );
