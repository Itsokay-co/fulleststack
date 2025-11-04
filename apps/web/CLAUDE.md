# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the web application.

## Overview

React 19 web application using Vite, TanStack Router for file-based routing, and TanStack Query for server state.

## Commands

```sh
# Development
pnpm dev         # Start dev server (http://localhost:5173)
pnpm build       # Build for production (outputs to apps/api/public)
pnpm preview     # Preview production build
pnpm test        # Run tests with Vitest

# Quality
pnpm typecheck   # Type check with TypeScript
pnpm lint        # Lint with ESLint
```

## Architecture

### File-Based Routing

Routes follow TanStack Router conventions:

```
src/routes/
├── __root.tsx              # Root layout component
├── index.tsx               # Home page (/)
├── _authenticated/         # Authenticated route group
│   ├── _layout.tsx         # Layout for authenticated routes
│   └── dashboard.tsx       # Dashboard page (/dashboard)
├── _auth/                  # Auth route group
│   ├── login.tsx           # Login page (/login)
│   └── register.tsx        # Register page (/register)
└── task/
    ├── $taskId.tsx         # Dynamic route (/task/:taskId)
    └── _layout.tsx         # Task section layout
```

**Key Conventions**:
- `_` prefix for route groups (layout routes)
- `$` prefix for dynamic parameters
- Auto-generated route tree in `src/route-tree.gen.ts`

### Router Setup

```typescript
const router = createRouter({
  routeTree,
  context: {
    auth: {
      user: null,
      session: null,
      isPending: false,
      isLoggedIn: false,
      isAdmin: false,
    },
  },
});

// Type registration for router
declare module "@tanstack/react-router" {
  type Register = {
    router: typeof router;
  };
}
```

### API Integration

- Vite proxies `/api` to `http://localhost:8787` during development
- Use shared API client from `@fulleststack/api-client`
- Build output goes to `apps/api/public` for unified deployment

## Data Fetching

Use TanStack Query for all server state:

```typescript
function useTasksQuery() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await apiClient.tasks.$get();
      return response.json();
    },
  });
}
```

## Forms & Validation

Use React Hook Form with Zod resolvers:

```typescript
const form = useForm<InsertTaskSchema>({
  resolver: zodResolver(insertTaskSchema),
  defaultValues: { name: "", done: false },
});
```

## Styling

Tailwind CSS v4 with utility-first approach:

```typescript
import { cn } from "@fulleststack/ui";

const Button = ({ className, ...props }) => (
  <button
    className={cn(
      "px-4 py-2 rounded-md bg-blue-600 text-white",
      "hover:bg-blue-700 focus:outline-none focus:ring-2",
      className
    )}
    {...props}
  />
);
```

## Route Protection

Use TanStack Router's `beforeLoad` for authentication:

```typescript
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isLoggedIn) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});
```

## Authentication

Better Auth client integration:

```typescript
import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
});

export function useAuth() {
  const { data: session, isPending } = authClient.useSession();

  return {
    user: session?.user || null,
    session: session?.session || null,
    isPending,
    isLoggedIn: !!session?.user,
    isAdmin: session?.user?.role === "admin",
    signIn: authClient.signIn.email,
    signOut: authClient.signOut,
  };
}
```

## Component Patterns

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  // Hooks at the top
  const [isLoading, setIsLoading] = useState(false);

  // Event handlers
  const handleClick = async () => {
    if (disabled || isLoading) return;
    setIsLoading(true);
    try {
      await onClick?.();
    } finally {
      setIsLoading(false);
    }
  };

  // Render
  return (
    <button onClick={handleClick} disabled={disabled || isLoading}>
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
```

## Testing

Use Vitest with React Testing Library:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

describe('Button Component', () => {
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

## Best Practices

- Use file-based routing with TanStack Router conventions
- Implement route guards with authentication context
- Use TanStack Query for all server state management
- Share validation schemas between frontend and API
- Use the `cn()` utility from `@fulleststack/ui` for class merging
- Follow responsive-first design with Tailwind
- Use HeadlessUI for complex interactive components
- Keep animations subtle with Framer Motion
- Implement loading skeletons for better UX
- Use proper error boundaries for graceful error handling
