import { Elysia } from "elysia";
import { corsMiddleware } from "@/middlewares/cors";
import { roles } from "@/modules/roles";

export const application = new Elysia().use(corsMiddleware).use(roles);

export type App = typeof application;
