import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { AuthLayout, Button, ErrorMessage, Field, Heading, Input, Label } from "@/web/components";

export const Route = createFileRoute("/_auth/reset-password")({
  component: ResetPassword,
  validateSearch: z.object({ token: z.string() }),
});

const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function ResetPassword() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    const res = await fetch("/api/password-reset/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ token, password: data.password }),
    });
    if (res.ok) {
      navigate({ to: "/" });
    }
    else {
      alert("Password reset failed");
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="grid w-full max-w-sm grid-cols-1 gap-8">
        <Heading>Set a new password</Heading>
        <Field>
          <Label>New password</Label>
          <Input {...register("password")} type="password" />
          {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
        </Field>
        <Field>
          <Label>Confirm password</Label>
          <Input {...register("confirmPassword")} type="password" />
          {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
        </Field>
        <Button type="submit" className="w-full">Change password</Button>
      </form>
    </AuthLayout>
  );
}
