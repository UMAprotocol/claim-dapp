import React from "react";
import tw, { styled } from "twin.macro";

import Heading from "./Heading";
import Button from "./Button";
import Link from "./Link";

const defaultProjects = [
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
  },
  {
    name: "uGAS - Ethereum Gas Futures",
    description:
      "A synthetic futures contract that settles to the 30-Day Median Ethereum Gas Price. Speculate on Ethereum gas prices with a Long or Short uGAS position. uGAS can be used as a hedge against the cost of gas on the Ethereum blockchain.",
    mintLink: "https://degenerative.finance/",
  },
  {
    name: "uSTONKS",
    description:
      "A synthetic that tracks the ten most bullish Wall Street Bets stocks and captures the sentiment of the r/WSB community.",
    mintLink: "https://degenerative.finance/",
  },
  {
    name: "Mario Cash",
    description: "A Bitcoin Cash synthetic token backed by renBTC.",
    mintLink: "https://mario.cash/",
  },
];

const OptionsList: React.FC = () => {
  const [expanded, setExpanded] = React.useState(false);
  const numberToShow = 4;
  const optionsToShow = defaultProjects.slice(
    0,
    expanded ? defaultProjects.length : numberToShow
  );
  return (
    <Wrapper>
      <MainHeading level={3}>Help UMA level up</MainHeading>
      <About>
        The more synthetic tokens you mint, the more UMA’s TVL will grow and the
        more uTVL-JUN options will be worth! Grow UMA’s TVL by using any of the
        below products!
      </About>
      <List>
        {optionsToShow.map((option) => (
          <li key={option.name}>
            <OptionWrapper>
              <Content>
                <OptionAvatar />
                <OptionText>
                  <Heading level={6}>{option.name}</Heading>
                  <Description>{option.description}</Description>
                </OptionText>
              </Content>
              <Link
                href={option.mintLink}
                rel="noopener norefferrer"
                target="_blank"
              >
                <MintButton variant="secondary">Mint</MintButton>
              </Link>
            </OptionWrapper>
          </li>
        ))}
      </List>
      {numberToShow < defaultProjects.length && (
        <SeeAllButton
          variant="secondary"
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          {expanded ? "See Less" : "See All Projects"}
        </SeeAllButton>
      )}
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
const OptionAvatar = tw.div`mr-5 bg-primary w-14 h-14 rounded-full`;
const Description = styled.p`
  ${tw`mt-3 text-lg`};
  max-width: 380px;
`;
const MintButton = styled(Button)`
  padding: 6px 30px;
`;
const SeeAllButton = styled(Button)`
  padding: 15px 46px;
  margin: auto;
`;
