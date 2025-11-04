import type { JSX } from "react";
import type { Tag } from "resend";

export type EmailTemplate<S, B> = {
  subject: (subjectProps: S) => string;
  body: (bodyProps: B) => JSX.Element;
};

export type EmailEnv = {
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
};

export type BaseSendMailOptions = {
  to: string;
  subject?: string;
  from?: string;
  replyTo?: string;
  tags?: Tag[];
};

export type SendMailViaTemplateOptions<S, B> = BaseSendMailOptions & S & B;
