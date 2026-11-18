import { Elysia } from "elysia";
import { CorsMiddleware } from "@/Middlewares/Cors";
import { Auth } from "@/Modules/User/Auth/Index";
import { UserRelation } from "@/Modules/User/UserRelation/Index";
import { DeleteTask } from "@/Modules/Tasks/Delete/Index";
import { ArchiveTask } from "@/Modules/Tasks/Archive/Index";
import { ActiveTask } from "@/Modules/Tasks/Active/Index";

export const Application = new Elysia()
  .use(CorsMiddleware)
  .use(Auth)
  .use(UserRelation)
  .use(DeleteTask)
  .use(ArchiveTask)
  .use(ActiveTask);

export type App = typeof Application;
