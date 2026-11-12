import { Elysia } from "elysia";
import { corsMiddleware } from "@/middlewares/cors";
import { roles } from "@/modules/roles";
import { auth } from "@/modules/auth";
import { user } from "@/modules/users";

export const application = new Elysia()
  .use(corsMiddleware)
  .use(roles)
  .use(auth)
  .use(user);

export type App = typeof application;
