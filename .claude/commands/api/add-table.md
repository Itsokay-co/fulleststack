# Add Database Table

You are tasked with adding a new database table to the API using Drizzle ORM.

## Step 1: Get Table Name

{{#if table_name}}
The table name is: **{{table_name}}**
{{else}}
First, ask the user for the table name using the AskUserQuestion tool. The table name should be:
- Singular form (e.g., "user", "task", "post")
- Lowercase
- Descriptive of what it stores

After getting the table name, proceed to Step 2.
{{/if}}

## Step 2: Clarify Table Fields

Ask the user about the fields they want in the table using the AskUserQuestion tool. For each field, you need:

1. **Field name** (camelCase, e.g., "firstName", "createdAt")
2. **Field type** (text, integer, boolean, timestamp, json, etc.)
3. **Constraints** (required/optional, unique, primary key)
4. **Default values** (if any)

Present the user with clear questions to gather this information. You may need to ask multiple questions to get all the details.

**Common fields to suggest** (but don't assume - always ask):
- `id` - Primary key (usually text or integer with auto-increment)
- `createdAt` - Timestamp of creation
- `updatedAt` - Timestamp of last update
- `userId` - Foreign key to users table (if relevant)

## Step 3: Create the Schema File

Once you have all the field information:

1. Create a new schema file at `apps/api/src/db/schemas/{tableName}.schema.ts`
2. Follow the Drizzle ORM patterns used in other schema files
3. Export the table schema and any types

Example structure:
```typescript
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tableName = sqliteTable("table_name", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type TableName = typeof tableName.$inferSelect;
export type NewTableName = typeof tableName.$inferInsert;
```

4. Export the new schema from `apps/api/src/db/schemas/index.ts`

## Step 4: Generate and Apply Migrations

After creating the schema:

1. Generate the migration:
   ```bash
   pnpm --filter api db:generate
   ```

2. Review the generated migration file in `apps/api/drizzle/migrations/`

3. Apply the migration to the database:
   ```bash
   pnpm --filter api db:push
   ```

## Step 5: Summary

Provide the user with:
- The location of the new schema file
- The migration file that was generated
- Confirmation that the migration was applied
- Suggested next steps (e.g., creating API routes, adding validation schemas)

## Important Notes

- **Always check existing schema files** in `apps/api/src/db/schemas/` to follow the same patterns
- **For foreign keys**: Ensure referenced tables exist first
- **For timestamps**: Use `integer` mode with timestamp conversion as shown in example
- **For Turso compatibility**: Use SQLite-compatible types (no PostgreSQL-specific types)
- **Type safety**: Always export both Select and Insert types
