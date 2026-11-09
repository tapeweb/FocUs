import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const database = drizzle({ client: pool });

export type TransactionClient = Parameters<
  Parameters<typeof database.transaction>[0]
>[0];

export type DatabaseClient = typeof database | TransactionClient;
