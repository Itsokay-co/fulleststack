import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AuthLayout, Button, ErrorMessage, Field, Heading, Input, Label, Link, Spinner, Text } from "@/web/components";
import { resetPassword } from "@/web/lib/auth-client";

export const Route = createFileRoute("/_auth/reset-password")({
  component: ResetPassword,
  validateSearch: z.object({
    token: z.string().length(24).optional(),
    error: z.string().optional(),
  }),
});

const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

function ResetPassword() {
  const { token, error } = Route.useSearch();
  const navigate = useNavigate();
  const [tokenExpired, setTokenExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    setIsLoading(true);
    const res = await resetPassword({
      newPassword: data.password,
      token,
    });

    if (res.error) {
      setTokenExpired(true);
    }
    else {
      navigate({ to: "/" });
    }
    setIsLoading(false);
  };

  const disable = !token || tokenExpired || !!error;

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="grid w-full max-w-sm grid-cols-1 gap-8">
        <Heading>Update your password</Heading>
        <Text>Your password must have at least 8 characters.</Text>
        {disable && (
          <Alert variant="error" title="Please try again" description="Your password reset request has expired. Please request a new one." actions={[<Link className="text-sm text-red-800 hover:bg-red-200 p-2 rounded" to="/forgot-password" key="request-new-password">Request new password</Link>]} />
        )}
        <Field>
          <Label>New Password</Label>
          <Input disabled={disable} type="password" {...register("password")} />
          {errors.password && <ErrorMessage>{errors?.password?.message}</ErrorMessage>}
        </Field>
        <Field>
          <Label>Confirm New Password</Label>
          <Input disabled={disable} type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && <ErrorMessage>{errors?.confirmPassword?.message}</ErrorMessage>}
        </Field>
        <Button disabled={disable || isLoading} type="submit" className="w-full">
          {isLoading ? <Spinner /> : "Reset password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
