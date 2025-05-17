import {
  applyD1Migrations,
  env,
} from "cloudflare:test";
import { testClient } from "hono/testing";
import { beforeAll, describe, expect, it } from "vitest";

import createApp from "@/api/lib/create-app";

import router from "./password-reset.index";

const client = testClient(createApp().route("/", router), env);

describe("password reset routes", async () => {
  beforeAll(async () => {
    // @ts-expect-error test
    await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
  });

  it("post /password-reset returns success", async () => {
    const response = await client.api["password-reset"].$post({
      json: { email: "test@example.com" },
    });
    expect(response.status).toBe(200);
  });
});
