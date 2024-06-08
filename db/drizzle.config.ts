import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  schema: "./schema.ts",
  out: "migrations",
  driver: "pg",
  verbose: true,
  dbCredentials: {
    database: "caption-crawler",
    host: process.env.DATABASE_HOST!,
    password: process.env.DATABASE_PASSWORD,
    user: process.env.DATABASE_USER,
  },
});
