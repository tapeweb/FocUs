import { Elysia, t } from "elysia";
import { database } from "../config/database";
import { usersTable } from "../database/schema/users";
import { count } from "drizzle-orm";

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

application.get(
  "/api/public/health/usersCount",
  async () => {
    const [row] = await database.select({ value: count() }).from(usersTable);

    return {
      status: 200 as const,
      count: row?.value ?? 0,
    };
  },
  {
    response: t.Object({
      status: t.Literal(200),
      count: t.Number(),
    }),
  },
);
