import { notNullable } from "@fulleststack/common";
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/api/lib/types";

import { tasks } from "@/api/db/schema";
import { hasRole } from "@/api/lib/auth";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/api/lib/constants";

import type { CreateRoute, GetOneRoute, ListRoute, PatchRoute, RemoveRoute } from "./tasks.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const db = c.get("db");
  const tasks = await db.query.tasks.findMany({
    orderBy(fields, operators) {
      return operators.desc(fields.createdAt);
    },
  });
  return c.json(tasks);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const db = c.get("db");
  const user = notNullable(c.get("user"));
  const task = c.req.valid("json");
  const [inserted] = await db.insert(tasks).values({ ...task, createdBy: user.id }).returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const db = c.get("db");
  const user = notNullable(c.get("user"));
  const { id } = c.req.valid("param");
  const task = await db.query.tasks.findFirst({
    where(fields, operators) {
      return operators.and(
        operators.eq(fields.id, id),
        // If user is not admin, they can only see their own tasks
        ...(hasRole(user, "admin") ? [] : [operators.eq(fields.createdBy, user.id)]),
      );
    },
  });

  if (!task) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(task, HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const db = c.get("db");
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }

  const [task] = await db.update(tasks)
    .set(updates)
    .where(eq(tasks.id, id))
    .returning();

  if (!task) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(task, HttpStatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const db = c.get("db");
  const { id } = c.req.valid("param");
  const result = await db.delete(tasks)
    .where(eq(tasks.id, id));

  if (result.rowsAffected === 0) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
