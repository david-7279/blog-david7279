import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Database dialect
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",

  // Output directory for migrations
  out: "./drizzle",

  // Database connection
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  // Logging and safety
  verbose: process.env.NODE_ENV === "development",
  strict: true,

  // Migrations table name (optional, defaults to __drizzle_migrations__)
  migrations: {
    table: "__drizzle_migrations__",
    schema: "public",
  },
});
