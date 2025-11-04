import { Emailer } from "@fulleststack/email";
import { createMiddleware } from "hono/factory";

import type { AppEnv } from "@/api/lib/types";

/**
 * Middleware that attaches emailer to the context
 */
export const attachEmailer = createMiddleware<AppEnv>(async (c, next) => {
  const emailer = new Emailer(c.env);

  // Attach emailer to context
  c.set("emailer", emailer);

  return next();
});
