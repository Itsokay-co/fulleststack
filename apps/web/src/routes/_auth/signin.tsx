import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AuthLayout, Button, Checkbox, CheckboxField, ErrorMessage, Field, Heading, Input, Label, Logo, Strong, Text, TextLink } from "@/web/components";
import { signIn } from "@/web/lib/auth-client";

export const Route = createFileRoute("/_auth/signin")({
  component: SignIn,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
});

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function SignIn() {
  const [hasError, setHasError] = useState(false);
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    setHasError(false);
    const res = await signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
    });

    if (res.error) {
      setHasError(true);
    }
    else {
      navigate({ to: redirect ?? "/" });
    }
  };
  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="grid w-full max-w-sm grid-cols-1 gap-8">
        <Logo className="h-16 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
        <Heading>Sign in to your account</Heading>
        {hasError && (
          <Alert variant="error" title="An error has occurred" description="Authentication failed. Please try again." />
        )}
        <Field>
          <Label>Email</Label>
          <Input {...register("email")} type="email" required autoComplete="email" />
          {errors.email && <ErrorMessage>{errors?.email?.message}</ErrorMessage>}
        </Field>
        <Field>
          <Label>Password</Label>
          <Input {...register("password")} type="password" required autoComplete="current-password" />
          {errors.password && <ErrorMessage>{errors?.password?.message}</ErrorMessage>}
        </Field>
        <div className="flex items-center justify-between">
          <CheckboxField>
            <Checkbox name="remember" />
            <Label>Remember me</Label>
          </CheckboxField>
          <Text>
            <TextLink to="/forgot-password">
              <Strong>Forgot password?</Strong>
            </TextLink>
          </Text>
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
        <Text>
          Don’t have an account?
          {" "}
          <TextLink to="/signup">
            <Strong>Sign up</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  );
}
