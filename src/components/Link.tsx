import React from "react";
import tw, { styled } from "twin.macro";

import { TextWrapper } from "./Wrappers";
import { FooterWrapper } from "./Footer";

type LinkProps = {
  href?: string;
} & React.HTMLProps<HTMLAnchorElement>;

const Link: React.FC<LinkProps> = ({ children, href, ...delegated }) => {
  const tag = typeof href === "string" ? "a" : "button";
  return (
    <Wrapper as={tag as any} href={href} {...delegated}>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.a`
  ${tw`no-underline focus:underline`}
  ${TextWrapper} & {
    ${tw`underline hover:no-underline`};
    box-shadow: 0 0 0 #000;
    ${tw`transition duration-300`}
    :hover {
      box-shadow: 0 2px 0 #000;
    }
  }
  ${FooterWrapper} & {
    box-shadow: 0 0 0 #fff;
    ${tw`transition duration-100`}
    :hover {
      box-shadow: 0 2px 0 #fff;
    }
  }
`;

export default Link;
