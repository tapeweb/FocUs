import Elysia from "elysia";
import { AuthModel } from "./Model";
import { AuthService } from "./Service";

export const Auth = new Elysia({ prefix: "/Auth" })
  .post(
    "/SignUp",
    async ({ body, status }) => {
      const Response = await AuthService.SignUp(body);

      if (!Response) return status(403, "Forbidden");
      return Response;
    },
    {
      body: AuthModel["SignUpBody"],
    },
  )
  .post(
    "/SignIn",
    async ({ body, status }) => {
      const Response = await AuthService.SignIn(body);

      if (!Response) return status(403, "Forbidden");
      return Response;
    },
    {
      body: AuthModel["SignInBody"],
    },
  );
