import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const BASE_PATH = "/api" as const;

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: "Required",
  EXPECTED_NUMBER: "Expected number, received nan",
  NO_UPDATES: "No updates provided",
};

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: "invalid_updates",
};

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
export const unauthorizedSchema = createMessageObjectSchema(HttpStatusPhrases.UNAUTHORIZED);
export const forbiddenSchema = createMessageObjectSchema(HttpStatusPhrases.FORBIDDEN);

export const unauthorized = {
  [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
    unauthorizedSchema,
    "Unauthorized",
  ),
};

export const forbidden = {
  [HttpStatusCodes.FORBIDDEN]: jsonContent(
    forbiddenSchema,
    "Forbidden",
  ),
};

export const trustedOrigins = ["fulleststackapp://", "http://localhost:5173", "http://localhost:8081", "exp://localhost:8081"];
