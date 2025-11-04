import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { requestId } from "hono/request-id";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";

import { attachAuthEntities } from "@/api/middlewares/auth";
import { attachDb } from "@/api/middlewares/db";
import { validateAndAttachEnv } from "@/api/middlewares/env";
import { pinoLogger } from "@/api/middlewares/logger";

import type { AppOpenAPI } from "./types";

import { attachEmailer } from "../middlewares/emailer";
import { BASE_PATH, trustedOrigins } from "./constants";
import createRouter from "./create-router";

export default function createApp() {
  const app = createRouter()
    .use("*", (c, next) => {
      if (c.req.path.startsWith(BASE_PATH)) {
        return next();
      }
      // SPA redirect to /index.html
      const requestUrl = new URL(c.req.raw.url);
      return c.env.ASSETS.fetch(new URL("/index.html", requestUrl.origin));
    })
    .basePath(BASE_PATH) as AppOpenAPI;

  // Adding env validation as first middleware
  app.use(validateAndAttachEnv);

  // RequestID before logger so logs can include the ID
  app.use(requestId());

  // Logger early to capture as many requests as possible
  app.use(pinoLogger());

  app.use(
    "*", // or replace with "*" to enable cors for all routes
    cors({
      origin: trustedOrigins,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS", "DELETE", "PATCH"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  );

  app.use(csrf({
    origin: trustedOrigins,
  }));

  app.use(serveEmojiFavicon("📝"))
    .use(attachDb)
    .use(attachEmailer)
    .use(attachAuthEntities) // depends on emailer and db to be attached first
    .on(["POST", "GET"], "/auth/**", (c) => {
      return c.get("auth").handler(c.req.raw);
    });

  app.notFound(notFound);
  app.onError(onError);
  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route("/", router);
}
