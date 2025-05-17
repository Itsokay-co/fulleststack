import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Alert, Logo, AuthLayout, Button, Checkbox, CheckboxField, Field, Heading, Input, Label, Select, Strong, Text, TextLink, ErrorMessage } from "@/web/components";
import { signUp } from "@/web/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

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
      name: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    setHasError(false);
    const res = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
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
        <Heading>Create your account</Heading>
        {hasError && (
          <Alert variant="error" title="An error has occurred" description="Authentication failed. Please try again." />
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
        <Button type="submit" className="w-full">
          Create account
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
