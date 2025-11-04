/**
 * This file is used to configure the BetterAuth library.
 * It is never imported anywhere on a serverless setup.
 */

import { Emailer } from "@fulleststack/email";
/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import path from "node:path";

import { createDb } from "@/api/db";
import { validateEnv } from "@/api/env";
import { configureAuth } from "@/api/lib/auth";

// Load environment variables for development tools
config({
  path: path.resolve(__dirname, "../../.dev.vars"),
});

const env = validateEnv(process.env);
const db = createDb(env);
const emailer = new Emailer(env);

export const auth = configureAuth(db, emailer, env);
