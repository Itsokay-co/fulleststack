import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { AuthError } from "@/web/lib/auth-client";

import { Alert, AuthLayout, Button, Checkbox, CheckboxField, ErrorMessage, Field, Heading, Input, Label, Logo, Spinner, Strong, Text, TextLink } from "@/web/components";
import { getAuthError, signIn } from "@/web/lib/auth-client";

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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<AuthError | null>(null);
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
    setErrorMessage(null);
    setIsLoading(true);
    await signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: true,
    }, {
      onError: (ctx) => {
        setErrorMessage(getAuthError({ code: ctx.error.code, fallbackMessage: ctx.error.message }));
      },
      onSuccess: () => {
        navigate({ to: redirect ?? "/" });
      },
    });
    setIsLoading(false);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="grid w-full max-w-sm grid-cols-1 gap-8">
        <Logo className="h-16 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
        <Heading>Sign in to your account</Heading>
        {errorMessage && (
          <Alert variant="error" title={errorMessage.title} description={errorMessage.description} />
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
        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? <Spinner /> : "Sign in"}
        </Button>
        <Text>
          Don't have an account?
          {" "}
          <TextLink to="/signup">
            <Strong>Sign up</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  );
}
