import { Elysia } from "elysia";
import { corsMiddleware } from "../middlewares/cors";
export const application = new Elysia();

application.use(corsMiddleware);
