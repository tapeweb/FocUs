import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./Drizzle",
  schema: "./Source/Database/Schema/*",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
