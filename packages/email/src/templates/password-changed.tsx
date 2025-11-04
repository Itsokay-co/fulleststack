import { COMPANY_NAME, LOGO_URL, SUPPORT_EMAIL } from "@fulleststack/common";
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

export type PasswordChangedSubjectProps = unknown;

export type PasswordChangedEmailProps = {
  name: string;
  updatedDate: Date;
  passwordResetUrl: string;
};

export const PasswordChangedTemplate: EmailTemplate<PasswordChangedSubjectProps, PasswordChangedEmailProps> = {
  subject: () => "Your password is changed",
  body: PasswordChangedEmail,
};

export function PasswordChangedEmail({
  name,
  updatedDate,
  passwordResetUrl,
}: PasswordChangedEmailProps) {
  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(updatedDate);

  return (
    <Layout>
      <Preview>
        You updated the password for your
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
            You updated the password for your
            {" "}
            {COMPANY_NAME}
            {" "}
            account on
            {" "}
            {formattedDate}
            . If this was you, then no further action is
            required.
          </Text>
          <Text className="leading-6 text-sm">
            However if you did NOT perform this password change, please
            {" "}
            <Link href={passwordResetUrl} className="underline">
              reset your account password
            </Link>
            {" "}
            immediately.
          </Text>
          <Text className="leading-6 text-sm">
            Remember to use a password that is both strong and unique to your
            {COMPANY_NAME}
            {" "}
            account.
          </Text>
          <Text className="leading-6 text-sm">
            Still have questions? Please contact
            {" "}
            <Link href={`mailto:${SUPPORT_EMAIL}`} className="underline">
              {COMPANY_NAME}
              {" "}
              Support
            </Link>
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

PasswordChangedEmail.PreviewProps = {
  name: "alanturing",
  updatedDate: new Date("June 23, 2022 4:06:00 pm UTC"),
  passwordResetUrl: "https://localhost:5173/reset-password",
} as PasswordChangedEmailProps;

export default PasswordChangedEmail;
