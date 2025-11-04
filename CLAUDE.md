# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **pnpm monorepo** using **Turborepo** for build orchestration, featuring:
- **API**: Hono on Cloudflare Workers with Drizzle ORM and Turso
- **Web**: React 19 + Vite with TanStack Router
- **Mobile**: Expo React Native with Expo Router
- **Shared packages**: Type-safe API client, common utilities, UI helpers, email templates

All applications share type-safe APIs, authentication (Better Auth), and common code.

## App-Specific Documentation

For detailed guidance on each application, see:
- **API**: [apps/api/CLAUDE.md](apps/api/CLAUDE.md) - Hono patterns, database, auth, testing
- **Web**: [apps/web/CLAUDE.md](apps/web/CLAUDE.md) - TanStack Router, forms, styling
- **Mobile**: [apps/mobile/CLAUDE.md](apps/mobile/CLAUDE.md) - Expo Router, NativeWind, native features

## Specialized Agents

This repository has specialized agents in `.claude/agents/` for different types of work. **Use these agents proactively** by delegating tasks to them using the Task tool:

- **backend-dev**: For API routes, database schemas, Drizzle ORM, Better Auth, Hono handlers, OpenAPI specs
- **frontend-dev**: For React web components, TanStack Router, forms, Tailwind styling
- **mobile-dev**: For React Native, Expo Router, NativeWind, native features
- **code-reviewer**: For reviewing code quality, patterns, type safety, testing, security
- **design-reviewer**: For UI/UX reviews, accessibility checks, design consistency

**When to delegate**: When a task clearly falls into one of these specializations, use the Task tool with the appropriate `subagent_type` to delegate the work. The specialized agents have deep context about their domain and follow established patterns from their respective CLAUDE.md files.

## Monorepo Commands

### Development
```sh
pnpm dev                   # Start all apps in development mode
pnpm --filter <app> dev    # Start specific app (api, web, mobile)
```

### Testing & Quality
```sh
pnpm test                  # Run all tests across workspace
pnpm lint                  # Lint all packages
pnpm lint:fix              # Auto-fix linting issues
pnpm typecheck             # Type check all packages
```

### Building & Deployment
```sh
pnpm build                 # Build all apps
pnpm --filter <app> build  # Build specific app
pnpm deploy                # Deploy all apps
```

### Database Operations
```sh
pnpm --filter api db:push              # Apply migrations to Turso
pnpm --filter api db:generate          # Generate new migrations
pnpm --filter api generate-auth-schema # Generate Better Auth schema
```

### Template Synchronization

This repo can be used as a template and synced with upstream:

```sh
pnpm template:setup              # Add template repository as remote (one-time)
pnpm template:list               # View available updates from template
pnpm template:list --since <sha> # View updates since specific commit
pnpm template:apply <sha>        # Cherry-pick specific commits
pnpm template:apply <sha1> <sha2> # Apply multiple commits
```

## Critical Cross-Cutting Pattern: Type-Safe API Client

**This is the most important architectural pattern in the monorepo.**

The API client provides full type safety between frontend and backend:

1. API exports a standalone `router` type from `apps/api/src/routes/index.ts`
2. API client imports this type: `import type { router } from "@fulleststack/api/routes"`
3. Frontend apps use the client with full type inference

```typescript
// In packages/api-client/src/index.ts
const client = hc<router>("");
export type Client = typeof client;

// In web/mobile apps
const response = await apiClient.tasks.$get();
const tasks = await response.json(); // Fully typed!
```

**Critical**: The API must be built before other apps can get proper types. When adding/changing API routes, rebuild the API to update client types.

## Dependency Management

### Version Pinning

Critical dependencies are pinned at root level using pnpm overrides in `package.json`:

```json
"pnpm": {
  "overrides": {
    "react": "19.1.0",
    "typescript": "5.9.2",
    ...
  }
}
```

### Finding Compatible Versions

Use the version finder scripts before adding dependencies:

```sh
# Find React-compatible versions
pnpm find-dep-version @tanstack/react-query react 19.1.0

# Find compatible versions for any dependency relationship
pnpm find-dep-version <package> <dependency> <version>

# Options
--all          # Search all versions (slower but thorough)
--timeout=N    # Set custom timeout in ms (default: 60000)
```

The script provides:
- Recommended stable version with compatibility details
- Installation commands
- Newer pre-release versions (if available)
- Checks against blacklist in `scripts/version-blacklist.json`

### Adding Dependencies

1. Check compatibility first with `find-dep-version`
2. Add to root `pnpm.overrides` if used by multiple packages
3. Use `workspace:^` for stable packages, `workspace:*` for frequently updated ones
4. Run `pnpm syncpack:check` to verify consistency

### Workspace References

In package.json files, use workspace references:

```json
"dependencies": {
  "react": "workspace:*",
  "@fulleststack/common": "workspace:^"
}
```

## Project Structure

```
fulleststack/
├── apps/
│   ├── api/              # Cloudflare Workers API (see apps/api/CLAUDE.md)
│   ├── web/              # React web app (see apps/web/CLAUDE.md)
│   ├── mobile/           # Expo mobile app (see apps/mobile/CLAUDE.md)
│   ├── db/               # Local Turso database setup
│   └── email-designer/   # Email template designer
├── packages/
│   ├── api-client/       # Type-safe API client (critical!)
│   ├── common/           # Shared utilities and types
│   ├── email/            # Email templates and service
│   ├── eslint-config/    # Shared ESLint config
│   └── ui/               # Shared UI utilities (cn function)
└── scripts/              # Monorepo maintenance scripts
```

## Shared Packages

- **@fulleststack/api-client**: Type-safe Hono RPC client - **depends on API being built first**
- **@fulleststack/common**: Shared utilities, types, Zod schemas
- **@fulleststack/ui**: Shared UI utilities (`cn` function for class merging)
- **@fulleststack/email**: React Email templates and emailer service
- **@fulleststack/eslint-config**: Shared ESLint config based on @antfu/eslint-config

## Naming Conventions

- **Directories**: kebab-case (`user-management/`)
- **Files**: kebab-case (`user-service.ts`)
- **Components**: PascalCase (`UserProfile.tsx`)
- **Database schemas**: `*.schema.ts`
- **API routes**: `*.routes.ts`
- **API handlers**: `*.handlers.ts`
- **Tests**: `*.test.ts` or `*.spec.ts`

## Turborepo Task Dependencies

Defined in `turbo.json`:
- `build` depends on `clean` and `^build` (dependencies build first)
- `typecheck`, `lint` depend on upstream packages being processed first
- `dev` is persistent and doesn't cache

## Important Notes

- **All pnpm commands run from repo root** - use `--filter <app>` to target specific packages
- **Node version**: >=22.15.0 required
- **Package manager**: pnpm >=10.0.0 required
- **Web app builds to API public folder**: `apps/web` builds to `apps/api/public` for unified Cloudflare deployment
- **API client types**: Rebuild API when making route changes to update frontend types
- **Better Auth schema**: Regenerate with `generate-auth-schema` after changing auth config
- **Version consistency**: Use `pnpm syncpack:check` and `pnpm syncpack:fix` to maintain version alignment
