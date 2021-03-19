import React from "react";
import tw, { styled } from "twin.macro";
import { MaxWidthWrapper, TextWrapper } from "./Wrappers";
import Heading from "./Heading";
import Link from "./Link";

const About: React.FC = () => {
  return (
    <MaxWidthWrapper>
      <Wrapper>
        <MainHeading level={3}>About UMA KPI Options</MainHeading>
        <TextWrapper>
          <p>
            UMA has airdropped a new incentive mechanism called a Key
            Performance Indicator (KPI) option to a{" "}
            <Link
              href="https://github.com/UMAprotocol/token-distribution/blob/master/outputs/governance_recipients.json"
              target="_blank"
              rel="noopener noreferrer"
            >
              curated list of addresses
            </Link>
            . The token airdropped is called uTVL-JUN and the value of each
            token option depends on UMA’s Total Value Locked (TVL), thereby
            giving every recipient an incentive to grow UMA protocol!
          </p>
          <p>
            Compared to a typical airdrop which can be easily dumped, KPI
            options are synthetic tokens that will pay out more rewards as the
            core KPI of the protocol grows.
          </p>
          <p>
            The Risk Labs foundation has allotted 2,000,000 UMA tokens for this
            purpose. uTVL-JUN holders will be able to redeem their token options
            for UMA tokens on July 1, 2021 at 00:00 UTC. uTVL-JUN tokens will
            have a minimum value of 0.1 $UMA each — but if the KPI target is
            hit, they will pay out 2 $UMA. View{" "}
            <Link
              href="https://medium.com/uma-project/uma-kpi-options-and-airdrop-bae86be16ce4"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>{" "}
            to learn more about KPI options and{" "}
            <Link
              href="https://medium.com/uma-project/uma-airdrop-recipient-addresses-a9ba41dfadc2"
              rel="noopener norefferrer"
              target="_blank"
            >
              airdrop
            </Link>{" "}
            details.
          </p>
        </TextWrapper>
      </Wrapper>
    </MaxWidthWrapper>
  );
};

const Wrapper = tw.div`py-20`;
const MainHeading = styled(Heading)`
  font-size: 2rem;
  ${tw`mb-8 text-center leading-snug`}
`;
export default About;
