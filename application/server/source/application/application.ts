import { Elysia, t } from "elysia";

export const application = new Elysia();

application.get(
  "/api/public/health",
  () => ({
    status: 200,
    message: "FocUs is healthy by Elysia.JS",
    timestamp: Date.now(),
  }),
  {
    response: t.Object({
      status: t.Number(),
      message: t.String(),
      timestamp: t.Number(),
    }),
  },
);
