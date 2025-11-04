import { createMiddleware } from "hono/factory";

import type { AppEnv } from "@/api/lib/types";

import { createDb } from "@/api/db";

/**
 * Middleware that attaches database to the context
 */
export const attachDb = createMiddleware<AppEnv>(async (c, next) => {
  const db = createDb(c.env);

  // Attach db to context
  c.set("db", db);

  return next();
});
