import React from "react";
import tw, { styled } from "twin.macro";

import Heading from "./Heading";
import Button from "./Button";
import Link from "./Link";
import MarioCashLogo from "../assets/mario-cash.svg";
import OpenDAOLogo from "../assets/opendao-logo.png";
import uStonksLogo from "../assets/ustonks-logo.png";
import uGasLogo from "../assets/ugas-logo.png";

const projects = [
  {
    name: "OpenDAO",
    description: (
      <>
        Leverage ETH or BTC to mint{" "}
        <Link
          href="https://medium.com/uma-project/the-yield-dollar-on-uma-3a492e79069f"
          target="_blank"
          rel="noopener noreferrer"
        >
          yield dollars
        </Link>
      </>
    ),
    mintLink: "https://opendao.io/",
    imgUrl: OpenDAOLogo,
  },
  {
    name: "uGAS - Ethereum Gas Futures",
    description:
      "A synthetic futures contract that settles to the 30-Day Median Ethereum Gas Price. Speculate on Ethereum gas prices with a Long or Short uGAS position. uGAS can be used as a hedge against the cost of gas on the Ethereum blockchain.",
    mintLink: "https://degenerative.finance/",
    imgUrl: uGasLogo,
  },
  {
    name: "uSTONKS",
    description:
      "A synthetic that tracks the ten most bullish Wall Street Bets stocks and captures the sentiment of the r/WSB community.",
    mintLink: "https://degenerative.finance/",
    imgUrl: uStonksLogo,
  },
  {
    name: "Mario Cash",
    description: "A Bitcoin Cash synthetic token backed by renBTC.",
    mintLink: "https://mario.cash/",
    imgUrl: MarioCashLogo,
  },
];

const OptionsList: React.FC = () => {
  return (
    <Wrapper>
      <MainHeading level={3}>Help UMA level up</MainHeading>
      <About>
        The more synthetic tokens you mint, the more UMA’s TVL will grow and the
        more uTVL-JUN options will be worth! Grow UMA’s TVL by using any of the
        below products!
      </About>
      <List>
        {projects.map((project) => (
          <li key={project.name}>
            <OptionWrapper>
              <Content>
                <OptionAvatar src={project.imgUrl} />
                <OptionText>
                  <Heading level={6}>{project.name}</Heading>
                  <Description>{project.description}</Description>
                </OptionText>
              </Content>
              <Link
                href={project.mintLink}
                rel="noopener norefferrer"
                target="_blank"
              >
                <MintButton variant="secondary">Mint</MintButton>
              </Link>
            </OptionWrapper>
          </li>
        ))}
        <SeeAllWrapper>
          <SeeAllButton
            href="https://umaproject.org/projects.html"
            target="_blank"
            rel="noopener norefferrer"
          >
            See All Projects
          </SeeAllButton>
        </SeeAllWrapper>
      </List>
    </Wrapper>
  );
};

export default OptionsList;
const Wrapper = tw.div`flex flex-col `;
const MainHeading = styled(Heading)`
  font-size: 2rem;
  ${tw`text-center mb-5`}
`;
const About = tw.p`text-xl`;
const List = tw.ul`flex flex-col divide-y divide-gray`;
const OptionWrapper = styled.div`
  ${tw`pb-5 flex justify-between`};
  padding-top: 30px;
`;
const Content = tw.div`flex`;
const OptionText = tw.div`flex flex-col`;
const OptionAvatar = tw.img`mr-5 w-14 h-14 rounded-full`;
const Description = styled.p`
  ${tw`mt-3 text-lg`};
  max-width: 380px;
`;
const MintButton = styled(Button)`
  padding: 6px 30px;
`;
const SeeAllButton = styled(Link)`
  ${tw`bg-secondary text-black rounded`};
  padding: 15px 46px;
  margin: auto;
`;
const SeeAllWrapper = styled.li`
  display: flex;
  padding-top: 30px;
  width: 100%;
`;
