/* eslint-disable ts/no-redeclare */
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "./auth.schema";

export const tasks = sqliteTable("tasks", {
  id: integer({ mode: "number" })
    .primaryKey({ autoIncrement: true }),
  name: text()
    .notNull(),
  done: integer({ mode: "boolean" })
    .notNull()
    .default(false),
  dueDate: integer({ mode: "timestamp" }),
  createdBy: text()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

export const selectTasksSchema = createSelectSchema(tasks);

export const insertTasksSchema = createInsertSchema(
  tasks,
  {
    name: schema => schema.min(1).max(500),
    dueDate: () => z.coerce.date().nullable().optional(),
  },
).required({
  done: true,
}).omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export const patchTasksSchema = insertTasksSchema.partial();

export type selectTasksSchema = z.infer<typeof selectTasksSchema>;
export type insertTasksSchema = z.infer<typeof insertTasksSchema>;
export type patchTasksSchema = z.infer<typeof patchTasksSchema>;
