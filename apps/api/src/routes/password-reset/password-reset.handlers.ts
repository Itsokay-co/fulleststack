import { eq, gt } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/api/lib/types";
import { accounts, users, verifications } from "@/api/db/auth.schema";

import type { ConfirmResetRoute, RequestResetRoute } from "./password-reset.routes";

export const requestReset: AppRouteHandler<RequestResetRoute> = async (c) => {
  const db = c.get("db");
  const { email } = c.req.valid("json");

  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, email);
    },
  });

  if (user) {
    const token = uuidv4();
    await db.insert(verifications).values({
      id: uuidv4(),
      identifier: email,
      value: token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });
    // In production an email would be sent here
    return c.json({ message: "Password reset token created", token }, HttpStatusCodes.OK);
  }

  return c.json({ message: "If the email exists, you'll receive instructions." }, HttpStatusCodes.OK);
};

export const confirmReset: AppRouteHandler<ConfirmResetRoute> = async (c) => {
  const db = c.get("db");
  const auth = c.get("auth");
  const { token, password } = c.req.valid("json");

  const verification = await db.query.verifications.findFirst({
    where(fields, operators) {
      return operators.and(
        operators.eq(fields.value, token),
        operators.gt(fields.expiresAt, new Date()),
      );
    },
  });

  if (!verification) {
    return c.json({ message: "Invalid or expired token" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, verification.identifier);
    },
  });

  if (!user) {
    return c.json({ message: "Invalid token" }, HttpStatusCodes.UNAUTHORIZED);
  }

  await db.update(accounts)
    .set({ password })
    .where(eq(accounts.userId, user.id));

  await db.delete(verifications)
    .where(eq(verifications.id, verification.id));

  // Attempt automatic sign-in using better-auth
  try {
    const res = await auth.api.signIn.email({
      email: user.email,
      password,
      rememberMe: true,
    }, { headers: c.req.raw.headers });
    return res;
  }
  catch {
    return c.json({ message: "Password reset" }, HttpStatusCodes.OK);
  }
};
