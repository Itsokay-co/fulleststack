/**
 * Authentication and authorization module for the API
 * Uses better-auth library to manage users, sessions, and permissions
 */

import type { Emailer } from "@fulleststack/email";
import type { Role } from "better-auth/plugins/access";
import type { AdminOptions } from "better-auth/plugins/admin";

import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";
import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

import type { accounts, sessions, users } from "@/api/db/auth.schema";

import type { Db } from "../db";
import type { Environment } from "../env";

import { trustedOrigins } from "./constants";

/**
 * Permission statements for access control
 * Extends default statements with task-specific permissions
 */
export const statements = {
  ...defaultStatements,
  task: ["create", "update", "delete"],
} as const;

const ac = createAccessControl(statements);

/**
 * Role definitions with associated permissions
 * - user: Basic role with no task permissions
 * - editor: Can create and update tasks
 * - admin: Has full administrative permissions including task management
 */
export const roles = {
  user: ac.newRole({
    task: [],
  }),

  editor: ac.newRole({
    task: ["create", "update"],
  }),

  admin: ac.newRole({
    ...adminAc.statements,
    task: ["create", "update", "delete"],
  }),
};

/**
 * Admin plugin configuration with access control and roles
 */
export const adminOptions: AdminOptions & { roles: { [key in string]?: Role; } } = {
  ac,
  roles,
};

/**
 * Configure authentication system with database, email provider, and plugins
 * @param db Database instance
 * @param emailer Email service for sending auth-related emails
 * @param env Environment variables
 * @returns Configured auth instance
 */
export function configureAuth(db: Db, emailer: Emailer, env: Environment) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      usePlural: true,
    }),
    trustedOrigins,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      resetPasswordTokenExpiresIn: 10 * 60, // 10 minutes
      sendResetPassword: async ({ user, url }) => {
        await emailer.resetPassword({ to: user.email, name: user.name, url });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      expiresIn: 60 * 60, // 1 hour
      sendVerificationEmail: async ({ user, token }) => {
        const url = `${env.WEB_URL}/verify-email?token=${token}`;
        await emailer.verifyEmail({ to: user.email, name: user.name, url });
      },
    },
    plugins: [
      admin(adminOptions),
      openAPI(),
      expo(),
    ],
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache duration in seconds
      },
    },
    // Advanced configuration options (currently commented out)
    // advanced: {
    //   crossSubDomainCookies: {
    //     enabled: true,
    //   },
    //   defaultCookieAttributes: {
    //     sameSite: "none",
    //     secure: true,
    //     partitioned: true, // New browser standards will mandate this for foreign cookies
    //   },
    // },
  });
}

/**
 * Type definitions for database entities
 */
export type User = typeof users.$inferInsert;
export type Session = typeof sessions.$inferInsert;
export type Account = typeof accounts.$inferInsert;

/**
 * Check if a user has a specific role
 * @param user User object to check
 * @param role Role to verify
 * @returns True if the user has the specified role
 */
export function hasRole(user: User, role: keyof typeof roles) {
  return user.role?.split(",").includes(role);
}

/**
 * Check if a user has permission to perform an action
 * @param role Role to check
 * @param permissions Permissions to check
 * @returns True if the user has the necessary permissions
 */
export function hasPermission({ role, permissions }: {
  role: string;
  permissions: { [key: string]: string[] };
}) {
  // Check each role the user has
  const roles = (role || adminOptions?.defaultRole || "user").split(",");
  const acRoles = adminOptions.roles;

  for (const role of roles) {
    const _role = acRoles[role as keyof typeof acRoles];
    const result = _role?.authorize(permissions);
    if (result?.success) {
      return true;
    }
  }

  return false;
}
