import React from "react";
import tw, { styled } from "twin.macro";

import { ReactComponent as Logo } from "../assets/logo.svg";
import { Twitter, Medium, Github, Discord, Discourse } from "../assets/icons";
import Link from "./Link";
import { MaxWidthWrapper } from "./Wrappers";

const links = [
  {
    name: "How UMA Works",
    to: "https://docs.umaproject.org/getting-started/overview",
  },
  {
    name: "Getting Started",
    to: "https://docs.umaproject.org/build-walkthrough/build-process",
  },
  {
    name: "Docs",
    to: "https://docs.umaproject.org/",
  },
  {
    name: "Vote",
    to: "https://vote.umaproject.org/",
  },
  { name: "Rewards", to: "/" },
];
const Navbar: React.FC = () => (
  <Wrapper>
    <NavWrapper as="nav">
      <Link href="https://umaproject.org">
        <Logo />
      </Link>
      <LinksWrapper>
        <LinksList>
          {links.map((link) => (
            <li key={link.name}>
              <NavLink href={link.to}>{link.name}</NavLink>
            </li>
          ))}
        </LinksList>
        <IconsList>
          <IconItem>
            <Link
              href="https://medium.com/uma-project"
              rel="noopener norefferrer"
              target="_blank"
            >
              <Medium />
            </Link>
          </IconItem>
          <IconItem>
            <Link
              href="https://github.com/umaprotocol"
              rel="noopener norefferrer"
              target="_blank"
            >
              <Github />
            </Link>
          </IconItem>
          <IconItem>
            <Link
              href="https://twitter.com/umaprotocol"
              rel="noopener norefferrer"
              target="_blank"
            >
              <Twitter />
            </Link>
          </IconItem>
          <IconItem>
            <Link
              href="https://discourse.umaproject.org/"
              rel="noopener norefferrer"
              target="_blank"
            >
              <Discourse />
            </Link>
          </IconItem>
          <IconItem>
            <Link
              href="https://discord.com/invite/jsb9XQJ"
              rel="noopener norefferrer"
              target="_blank"
            >
              <Discord />
            </Link>
          </IconItem>
        </IconsList>
      </LinksWrapper>
    </NavWrapper>
  </Wrapper>
);

export default Navbar;

const Wrapper = tw.div`w-full bg-secondary`;
const NavWrapper = tw(MaxWidthWrapper)`
    flex justify-between items-center px-10 pb-14 pt-12
    
`;
const NavLink = tw(Link)`
      font-semibold hocus:text-primary transition-colors duration-300
`;
const LinksWrapper = tw.div`flex`;
const List = tw.ul`flex`;
const IconsList = styled(List)`
  margin-left: 50px;
  > * + * {
    ${tw`ml-9`}
  }
`;
const LinksList = styled(List)`
  > * + * {
    ${tw`ml-11`}
  }
`;
const IconItem = styled.li`
  max-width: 25px;
  max-height: 25px;
  ${tw`hover:opacity-50 transition-opacity duration-300`}
`;
