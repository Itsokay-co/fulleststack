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

export type ResetPasswordSubjectProps = unknown;

export type ResetPasswordEmailProps = {
  name: string;
  url: string;
};

export const ResetPasswordTemplate: EmailTemplate<ResetPasswordSubjectProps, ResetPasswordEmailProps> = {
  subject: () => "Reset your password",
  body: ResetPasswordEmail,
};

export function ResetPasswordEmail({
  name,
  url,
}: ResetPasswordEmailProps) {
  return (
    <Layout>
      <Preview>
        You requested to reset the password for your
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
            {" "}
            ,
          </Text>
          <Text className="leading-6 text-sm">
            We have received a request to reset your password.
          </Text>
          <Text className="leading-6 text-sm">
            If you didn't make this request, please ignore this message.
            {" "}
            Otherwise, you can reset your password by clicking the link below:
          </Text>
          <Text className="leading-6 text-sm">
            <Link href={url} className="underline">
              Reset your password
            </Link>
          </Text>
          <Text className="leading-6 text-sm">
            Remember to use a password that is both strong and unique to your
            {" "}
            {COMPANY_NAME}
            {" "}
            account.
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

ResetPasswordEmail.PreviewProps = {
  name: "alanturing",
  url: "https://localhost:5173/reset-password",
} as ResetPasswordEmailProps;

export default ResetPasswordEmail;
