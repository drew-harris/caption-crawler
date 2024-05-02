import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  schema: "./schema.ts",
  out: "migrations",
  driver: "pg",
  verbose: true,
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});
