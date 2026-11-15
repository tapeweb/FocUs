import { Elysia } from "elysia";
import { corsMiddleware } from "@/middlewares/cors";
import { roles } from "@/modules/roles";
import { auth } from "@/modules/auth";
import { user } from "@/modules/users";
import { activeTask } from "@/modules/active_tasks";
import { archiveTask } from "@/modules/archive_tasks";
import { deletedTask } from "@/modules/deleted_tasks";

export const application = new Elysia()
  .use(corsMiddleware)
  .use(roles)
  .use(auth)
  .use(user)
  .use(activeTask)
  .use(archiveTask)
  .use(deletedTask);

export type App = typeof application;
