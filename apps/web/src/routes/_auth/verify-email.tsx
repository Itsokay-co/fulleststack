import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import type { AuthError } from "@/web/lib/auth-client";

import { Alert, AuthLayout, Button, Heading, Logo, Spinner, Text } from "@/web/components";
import { getVerifyEmailError, verifyEmail } from "@/web/lib/auth-client";

export const Route = createFileRoute("/_auth/verify-email")({
  component: VerifyEmail,
  validateSearch: z.object({
    token: z.string(),
  }),
});

function VerifyEmail() {
  const { token } = Route.useSearch();
  const [error, setError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    await verifyEmail({ query: { token } }, {
      onError: (error) => {
        setError(getVerifyEmailError(error.error.message));
        setIsLoading(false);
      },
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => {
          navigate({ to: "/" });
        }, 3000);
        setIsLoading(false);
      },
    });
  };

  return (
    <AuthLayout>
      <div className="grid w-full max-w-sm grid-cols-1 gap-8">
        <Logo className="h-16 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
        <Heading>Verify your email</Heading>
        {error && <Alert variant="error" title={error.title} description={error.description} />}
        {showSuccess && <Alert variant="success" title="Email verified" description="You are being redirected to the home page." />}
        {!showSuccess && (
          <>
            <Text>Click the button below to verify your email.</Text>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <Spinner /> : "Verify email"}
            </Button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
