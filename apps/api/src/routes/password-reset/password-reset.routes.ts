import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

const tags = ["Password Reset"];

export const requestReset = createRoute({
  path: "/password-reset",
  method: "post",
  request: {
    body: jsonContentRequired(
      z.object({ email: z.string().email() }),
      "Email address"
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string(), token: z.string().optional() }),
      "Token for development"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(z.object({ email: z.string().email() })),
      "Validation error"
    ),
  },
});

export const confirmReset = createRoute({
  path: "/password-reset/confirm",
  method: "post",
  request: {
    body: jsonContentRequired(
      z.object({
        token: z.string(),
        password: z.string().min(8),
      }),
      "Token and new password"
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Password changed"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      z.object({ message: z.string() }),
      "Invalid token"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(
        z.object({ token: z.string(), password: z.string().min(8) })
      ),
      "Validation error"
    ),
  },
});

export type RequestResetRoute = typeof requestReset;
export type ConfirmResetRoute = typeof confirmReset;
