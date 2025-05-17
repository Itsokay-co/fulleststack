import { createFileRoute } from "@tanstack/react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { AuthLayout, Button, Field, Heading, Input, Label, Strong, Text, TextLink, ErrorMessage } from "@/web/components";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: ForgotPassword,
});

const schema = z.object({
  email: z.string().email(),
});

function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    await fetch("/api/password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    alert("Check your email for reset instructions");
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="grid w-full max-w-sm grid-cols-1 gap-8">
        <Heading>Reset your password</Heading>
        <Text>Enter your email and we’ll send you a link to reset your password.</Text>
        <Field>
          <Label>Email</Label>
          <Input {...register("email")} type="email" />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </Field>
        <Button type="submit" className="w-full">
          Reset password
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
