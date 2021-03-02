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
            UMA will be airdropping a new incentivization mechanism called a
            “KPI option” to a curated list of addresses in DeFi. The value of
            these options depends on the TVL of the UMA protocol, thereby giving
            every recipient an incentive to grow the protocol. (KPI = key
            performance indicator)
          </p>
          <p>
            Compared to a typical airdrop which can be easily dumped, KPI
            options are synthetic tokens that will pay out more rewards as the
            core KPI of the protocol grows.
          </p>
          <p>
            The Risk Labs foundation has allotted 2,000,000 $UMA [~$60M USD] for
            this purpose. The target date for the close of this program is June
            2021, at which point the KPI options will be redeemable for $UMA.
            These tokens will have a minimum value of 1 $UMA each — but if the
            KPI target is hit, they will pay out 20 $UMA, a 20x increase.
            <Link
              href="https://www.umaproject.org"
              rel="noopener norefferrer"
              target="_blank"
            >
              Read more
            </Link>
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
