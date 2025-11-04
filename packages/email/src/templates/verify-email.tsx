import { COMPANY_NAME, LOGO_URL } from "@fulleststack/common";
import {
  Column,
  Container,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

import type { EmailTemplate } from "../types";

import Footer from "../components/footer";
import Layout from "../components/layout";

export type VerifyEmailSubjectProps = unknown;

export type VerifyEmailProps = {
  name: string;
  url: string;
};

export const VerifyEmailTemplate: EmailTemplate<VerifyEmailSubjectProps, VerifyEmailProps> = {
  subject: () => "Verify your email address",
  body: VerifyEmail,
};

export function VerifyEmail({
  name,
  url,
}: VerifyEmailProps) {
  return (
    <Layout>
      <Preview>
        Please verify your email address for your
        {" "}
        {COMPANY_NAME}
        {" "}
        account
      </Preview>
      <Container className="max-w-[580px] mx-auto my-8 bg-white">
        <Section className="p-8">
          <Img
            width={114}
            src={LOGO_URL}
            alt={COMPANY_NAME}
            className="mx-auto"
          />
        </Section>
        <Section className="w-full">
          <Row>
            <Column className="border-b border-[#EEEEEE] w-[249px]" />
            <Column className="border-b border-[#9147FF] w-[102px]" />
            <Column className="border-b border-[#EEEEEE] w-[249px]" />
          </Row>
        </Section>
        <Section className="px-5 py-2.5">
          <Text className="leading-6 text-sm">
            Hi
            {" "}
            {name}
            ,
          </Text>
          <Text className="leading-6 text-sm">
            Thank you for signing up for
            {" "}
            {COMPANY_NAME}
            . To complete your registration, please verify your email address by clicking the link below:
          </Text>
          <Text className="leading-6 text-sm">
            <Link href={url} className="underline">
              Verify your email address
            </Link>
          </Text>
          <Text className="leading-6 text-sm">
            If you didn't create an account with
            {" "}
            {COMPANY_NAME}
            , you can safely ignore this email.
          </Text>
          <Text className="leading-6 text-sm">
            Thanks,
            <br />
            {COMPANY_NAME}
            {" "}
            Support Team
          </Text>
        </Section>
      </Container>
      <Footer />
    </Layout>
  );
}

VerifyEmail.PreviewProps = {
  name: "alanturing",
  url: "https://localhost:5173/verify-email",
} as VerifyEmailProps;

export default VerifyEmail;
