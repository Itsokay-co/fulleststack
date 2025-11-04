import type { CreateEmailOptions } from "resend";

import { Resend } from "resend";

import type {
  PasswordChangedEmailProps,
  PasswordChangedSubjectProps,
  ResetPasswordEmailProps,
  ResetPasswordSubjectProps,
  VerifyEmailProps,
  VerifyEmailSubjectProps,
} from "../templates";
import type {
  BaseSendMailOptions,
  EmailEnv,
  EmailTemplate,
  SendMailViaTemplateOptions,
} from "../types";

import {
  PasswordChangedTemplate,
  ResetPasswordTemplate,
  VerifyEmailTemplate,
} from "../templates";

export class Emailer {
  private readonly resend: Resend;

  constructor(private readonly env: EmailEnv) {
    this.resend = new Resend(this.env.RESEND_API_KEY);
  }

  async sendEmail(opts: CreateEmailOptions) {
    const { data, error } = await this.resend.emails.send(opts);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async resetPassword(props: BaseSendMailOptions & ResetPasswordSubjectProps & ResetPasswordEmailProps) {
    return this.sendUsingTemplate(ResetPasswordTemplate, props);
  }

  async passwordChanged(props: BaseSendMailOptions & PasswordChangedSubjectProps & PasswordChangedEmailProps) {
    return this.sendUsingTemplate(PasswordChangedTemplate, props);
  }

  async verifyEmail(props: BaseSendMailOptions & VerifyEmailSubjectProps & VerifyEmailProps) {
    return this.sendUsingTemplate(VerifyEmailTemplate, props);
  }

  private async sendUsingTemplate<S, B>(template: EmailTemplate<S, B>, opts: SendMailViaTemplateOptions<S, B>) {
    const react: React.ReactNode = template.body(opts);
    const subject = opts.subject ?? template.subject(opts);
    const from = opts.from ?? this.env.EMAIL_FROM;
    return await this.sendEmail({ react, subject, from, ...opts });
  }
}
