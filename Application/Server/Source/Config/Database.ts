import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const Database = drizzle({ client: pool });

export type TransactionClient = Parameters<
  Parameters<typeof Database.transaction>[0]
>[0];

export type DatabaseClient = typeof Database | TransactionClient;
