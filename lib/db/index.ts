import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

/**
 * Database connection configuration.
 *
 * DATABASE_URL is required at runtime and should be provided through
 * environment variables. The application fails fast if the variable
 * is missing to prevent starting with an invalid database configuration.
 */
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is not defined. " +
      "Please configure it before starting the application.",
  );
}

/**
 * Neon HTTP client.
 *
 * The Neon serverless driver is used here because the application runs
 * in a serverless-compatible environment where HTTP-based database
 * connections are preferred over persistent TCP connections.
 */
const sql = neon(databaseUrl);

/**
 * Drizzle database client.
 *
 * The schema is provided to Drizzle so that queries can use the
 * application's typed database schema and relational definitions.
 */
export const db = drizzle(sql, {
  schema,
});

/**
 * Re-export the database schema.
 *
 * This allows consumers to import both the database client and schema
 * definitions from the same module:
 *
 * import { db, posts } from "@/lib/db";
 */
export * from "./schema";
