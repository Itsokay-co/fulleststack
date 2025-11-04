import type { Emailer } from "@fulleststack/email";
import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

import type { Db } from "@/api/db";
import type { Environment } from "@/api/env";

import type { configureAuth, Session, User } from "./auth";
import type { BASE_PATH } from "./constants";

export type AppEnv = {
  Variables: {
    logger: PinoLogger;

    // Database is attached by the db middleware
    db: Db;

    // BetterAuth
    auth: ReturnType<typeof configureAuth>;
    user: User | null;
    session: Session | null;

    // Emailer is attached by the emailer middleware
    emailer: Emailer;

  };
  Bindings: {
    ASSETS: Fetcher;
  } & Environment;
};

// eslint-disable-next-line ts/no-empty-object-type
export type AppOpenAPI = OpenAPIHono<AppEnv, {}, typeof BASE_PATH>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppEnv>;
