# @fulleststack/api-client

A type-safe API client for communicating with the Fulleststack API.

## What is it?

This package provides a typed client wrapper for making requests to the Fulleststack API.
It imports the router definition from `@fulleststack/api/routes` and uses
Hono's client utilities (`hc`) to generate a fully type-safe client.

## How it works

The client leverages Hono's client generator with TypeScript to:

1. Import the API router type definition from the `@fulleststack/api` package
2. Create a type-safe client factory using Hono's `hc` utility
3. Export the client and its types for use in other packages

This approach ensures that all API endpoints, request parameters, and response types are fully typed,
providing autocompletion and type-checking during development.

## Usage

In the web application, the api-client is initialized with a base URL:

```typescript
// In apps/web/src/lib/api-client.ts
import apiClient from "@fulleststack/api-client";

export default apiClient("/");
```

Then it can be used to make typed API calls with full route autocompletion:

```typescript
// Example from apps/web/src/lib/queries.ts
import apiClient from "./api-client";

// GET request
const response = await apiClient.api.tasks.$get();
const data = await response.json();

// GET request with path parameters
const response = await apiClient.api.tasks[":id"].$get({
  param: {
    id: "123",
  },
});

// POST request with JSON body
const response = await apiClient.api.tasks.$post({
  json: taskData,
});

// PATCH request
const response = await apiClient.api.tasks[":id"].$patch({
  param: {
    id: "123",
  },
  json: updateData,
});

// DELETE request
const response = await apiClient.api.tasks[":id"].$delete({
  param: {
    id: "123",
  },
});
```

For error handling, the package exports an `ErrorSchema` type:

```typescript
import type { ErrorSchema } from "@fulleststack/api-client";

// Example error handling
if ("success" in json && !json.success) {
  const apiError = json as ErrorSchema;
  // Process error information
  console.error(apiError.error.issues);
}
```

The client preserves all type information from the API routes, providing autocompletion for:

- API endpoints
- Request methods
- Request parameters
- Response types
