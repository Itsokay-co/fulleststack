import { createMiddleware } from "hono/factory";

import type { AppEnv } from "@/api/lib/types";

import { validateEnv } from "@/api/env";

export const validateAndAttachEnv = createMiddleware<AppEnv>(async (c, next) => {
  validateEnv(c.env);
  return next();
});
