import React from "react";
import { MaxWidthWrapper } from "./Wrappers";
import tw, { styled } from "twin.macro";
import Link from "./Link";
import Heading from "./Heading";
import { ReactComponent as UnstyledLogo } from "../assets/logo.svg";
import { ArrowLeft } from "../assets/icons";
const footerLinks = [
  {
    name: "How UMA Works",
    href: "https://docs.umaproject.org/getting-started/overview",
  },
  { name: "Docs", href: "https://docs.umaproject.org/" },
  { name: "FAQS", href: "https://umaproject.org/faq.html" },
  { name: "Contact", href: "mailto:hello@umaproject.org" },
  {
    name: "Getting Started",
    href: "https://docs.umaproject.org/build-walkthrough/build-process",
  },
  { name: "Vote", href: "https://vote.umaproject.org/" },
  { name: "Careers", href: "https://angel.co/risk-labs/jobs" },
];

const SubscribeForm: React.FC = () => {
  return (
    <Form>
      <Input type="email" name="email" placeholder="Email Address" />
      <button type="submit">
        <ArrowLeft />
      </button>
    </Form>
  );
};

const Footer: React.FC = () => {
  return (
    <MaxWidthWrapper as="footer">
      <FooterWrapper>
        <div>
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div>
          <LinkList>
            {footerLinks.map((link) => (
              <ListItem key={link.name}>
                <Link
                  href={link.href}
                  target="_blank"
                  rel="noopener norefferrer"
                >
                  {link.name}
                </Link>
              </ListItem>
            ))}
          </LinkList>
        </div>
        <div>
          <FooterHeading level={6}>Get UMA Updates</FooterHeading>
          <FooterParagraph>
            Sign up for our newsletter to stay updated about the UMA project.
          </FooterParagraph>
          <SubscribeForm />
        </div>
      </FooterWrapper>
    </MaxWidthWrapper>
  );
};
export default Footer;

export const FooterWrapper = styled.div`
  ${tw`w-full px-10 py-20 grid md:divide-x md:divide-gray`};
  grid-template-columns: 24% 1fr 36%;
  > div + div {
    padding-left: 100px;
  }
`;
const LinkList = tw.ul`
 grid justify-center md:grid-cols-2 md:grid-rows-4 md:gap-x-16 grid-cols-1 md:max-h-40
`;
const ListItem = tw.li`
    leading-relaxed h-10
`;

const FooterParagraph = styled.p`
  ${tw`text-sm mb-4`};
  max-width: 230px;
`;

const Logo = styled(UnstyledLogo)`
  width: 100px;
`;

const FooterHeading = tw(Heading)`
    text-primary mb-2
`;

const Form = tw.form`
  flex justify-between border-b border-gray max-w-xs
`;
const Input = tw.input`
  w-full text-sm text-white bg-transparent py-2 pr-6   
`;
