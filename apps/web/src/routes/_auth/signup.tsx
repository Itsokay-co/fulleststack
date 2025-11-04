import type { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { AuthError } from "@/web/lib/auth-client";

import { Alert, AuthLayout, Button, Checkbox, CheckboxField, ErrorMessage, Field, Heading, Input, Label, Logo, Select, Spinner, Strong, Text, TextLink } from "@/web/components";
import { BASE_URL, getAuthError, signUp } from "@/web/lib/auth-client";

export const Route = createFileRoute("/_auth/signup")({
  component: SignUp,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
});

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<AuthError | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { redirect } = Route.useSearch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    setErrorMessage(null);
    setShowSuccess(false);
    setIsLoading(true);
    await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      callbackURL: `${BASE_URL}${redirect ?? "/"}`,
    }, {
      onError: (ctx) => {
        setErrorMessage(getAuthError({ code: ctx.error.code, fallbackMessage: ctx.error.message }));
      },
      onSuccess: () => {
        setShowSuccess(true);
      },
    });
    setIsLoading(false);
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="grid w-full max-w-sm grid-cols-1 gap-8">
        <Logo className="h-16 text-zinc-950 dark:text-white forced-colors:text-[CanvasText]" />
        <Heading>Create your account</Heading>
        {errorMessage
          ? (
              <Alert variant="error" title={errorMessage.title} description={errorMessage.description} />
            )
          : showSuccess && (
            <Alert variant="info" title="Verification Required" description="Verification email sent. Please verify your email." />
          )}
        <Field>
          <Label>Email</Label>
          <Input {...register("email")} type="email" required autoComplete="email" />
          {errors.email && <ErrorMessage>{errors?.email?.message}</ErrorMessage>}
        </Field>
        <Field>
          <Label>Full name</Label>
          <Input {...register("name")} required autoComplete="name" />
          {errors.name && <ErrorMessage>{errors?.name?.message}</ErrorMessage>}
        </Field>
        <Field>
          <Label>Password</Label>
          <Input {...register("password")} type="password" required autoComplete="new-password" />
          {errors.password && <ErrorMessage>{errors?.password?.message}</ErrorMessage>}
        </Field>
        <Field>
          <Label>Confirm password</Label>
          <Input {...register("confirmPassword")} type="password" required autoComplete="new-password" />
        </Field>
        <Field>
          <Label>Preferred language</Label>
          <Select name="country">
            <option>English</option>
            <option>Türkçe</option>
          </Select>
        </Field>
        <CheckboxField>
          <Checkbox name="remember" />
          <Label>Get emails about product updates and news.</Label>
        </CheckboxField>
        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? <Spinner /> : "Create account"}
        </Button>
        <Text>
          Already have an account?
          {" "}
          <TextLink to="/signin">
            <Strong>Sign in</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  );
}
