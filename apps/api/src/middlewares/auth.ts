import { notNullable } from "@fulleststack/common";
import { createMiddleware } from "hono/factory";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { statements } from "@/api/lib/auth";
import type { AppEnv } from "@/api/lib/types";

import { configureAuth, hasPermission, hasRole } from "@/api/lib/auth";

export const attachAuthEntities = createMiddleware<AppEnv>(async (c, next) => {
  const db = c.get("db");
  const emailer = c.get("emailer");

  if (!db || !emailer) {
    throw new Error("Database or emailer not found");
  }

  const auth = configureAuth(db, emailer, c.env);

  c.set("auth", auth);

  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

export const isLoggedIn = createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
  }

  return next();
});

export const isAdmin = createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
  }

  if (hasRole(user, "admin")) {
    return next();
  }

  return c.json({ message: HttpStatusPhrases.FORBIDDEN }, HttpStatusCodes.FORBIDDEN);
});

export function isAuthorizedTo(permissions: Partial<{
  [K in keyof typeof statements]?: (typeof statements)[K][number][];
}>) {
  return createMiddleware<AppEnv>(async (c, next) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
    }

    const canAccess = hasPermission({
      role: notNullable(user.role),
      permissions,
    });

    if (canAccess) {
      return next();
    }

    return c.json({ message: HttpStatusPhrases.FORBIDDEN }, HttpStatusCodes.FORBIDDEN);
  });
}
