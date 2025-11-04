import { COMPANY_ADDRESS, COMPANY_NAME, INSTAGRAM_URL, LINKEDIN_URL, X_URL } from "@fulleststack/common";
import { Column, Img, Link, Row, Section, Text } from "@react-email/components";

export default function Footer() {
  return (
    <Section className="max-w-[580px] mx-auto">
      <Row>
        <Column className="w-full opacity-100" align="center">
          <Link className="mx-2 inline-block" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <Img className="p-1 w-[32px]" src="https://img.icons8.com/color/48/linkedin.png" alt="linkedin" />
          </Link>
          <Link className="mx-2 inline-block" href={X_URL} target="_blank" rel="noopener noreferrer">
            <Img className="p-1 w-[32px]" src="https://img.icons8.com/color/48/twitterx--v1.png" alt="x" />
          </Link>
          <Link className="mx-2 inline-block" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
            <Img className="p-1 w-[32px]" src="https://img.icons8.com/color/48/instagram-new--v1.png" alt="instagram" />
          </Link>
        </Column>
      </Row>
      <Row>
        <Text className="text-center text-[#706a7b]">
          © 2025
          {" "}
          {COMPANY_NAME}
          , All Rights Reserved
          {" "}
          <br />
          {COMPANY_ADDRESS}
        </Text>
      </Row>
    </Section>
  );
}
