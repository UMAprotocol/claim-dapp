import React from "react";
import tw, { styled } from "twin.macro";

import { useConnection } from "../hooks";
import Button from "./Button";
import { ReactComponent as KPILogo } from "../assets/kpi-frame.svg";
import { Info, Settings } from "../assets/icons";
import { MaxWidthWrapper } from "./Wrappers";
import Heading from "./Heading";

function claimOptions() {
  console.log(`Claiming KPI options...`);
}
const Hero: React.FC = () => {
  const { isConnected, connect } = useConnection();
  const handleCTAClick = React.useCallback(() => {
    if (isConnected) {
      claimOptions();
    } else {
      connect();
    }
  }, [connect, isConnected]);
  return (
    <MaxWidthWrapper>
      <Wrapper>
        <CTAWrapper>
          <TitleWrapper>
            <KPILogo />
            <Title>UMA KPI Options</Title>
          </TitleWrapper>
          <Subtitle>
            The more UMA's TVL grows the more the KPI Options are worth!
          </Subtitle>
          <ButtonsWrapper>
            <StyledButton onClick={handleCTAClick}>
              {isConnected
                ? "Claim Options"
                : "Connect Wallet to Claim Options"}
            </StyledButton>
            {isConnected && (
              <StyledButton variant="secondary">
                Connected <Settings />
              </StyledButton>
            )}
          </ButtonsWrapper>
        </CTAWrapper>
        <MetricsWrapper>
          <MetricsGrid>
            <Metric>
              <div>
                <MetricBigHeading level={1}>$105.3</MetricBigHeading>
                <div>Million</div>
              </div>
              <MetricDescription>UMA total value locked</MetricDescription>
            </Metric>
            <Metric>
              <MetricHeader>
                <MetricHeading level={2}>2,000,000</MetricHeading>
                <MetricQuantifier>UMA</MetricQuantifier>
              </MetricHeader>
              <MetricDescription>
                Maximum reward <Info />
              </MetricDescription>
            </Metric>
            <Metric>
              <MetricHeader>
                <MetricHeading level={2}>325,000</MetricHeading>
                <MetricQuantifier>UMA</MetricQuantifier>
              </MetricHeader>
              <MetricDescription>
                Current expected reward <Info />
              </MetricDescription>
            </Metric>
            <Metric>
              <MetricHeader>
                <MetricHeading level={2}>100,000</MetricHeading>
                <MetricQuantifier></MetricQuantifier>
              </MetricHeader>
              <MetricDescription>
                KPI options in circulation <Info />
              </MetricDescription>
            </Metric>
            <Metric>
              <MetricHeader>
                <MetricHeading level={2}>3.25x</MetricHeading>
                <MetricQuantifier></MetricQuantifier>
              </MetricHeader>
              <MetricDescription>
                Current option multiplier <Info />
              </MetricDescription>
            </Metric>
          </MetricsGrid>
        </MetricsWrapper>
      </Wrapper>
    </MaxWidthWrapper>
  );
};

const Wrapper = styled.div`
  padding: 0 142px;
  ${tw`pb-10 pt-5`};
`;
const CTAWrapper = tw.div`flex flex-col items-center`;
const TitleWrapper = tw.div`flex`;
const Title = tw(Heading)`text-7xl leading-snug ml-7`;
const Subtitle = tw.span`text-xl leading-relaxed`;
const ButtonsWrapper = styled.div`
  ${tw`w-full flex justify-center items-center`};
  margin-top: 10px;
  > * + * {
    margin-left: 10px;
  }
`;
const StyledButton = styled(Button)`
  padding: 6px 30px;
`;
const MetricsWrapper = tw.div`
 w-full mt-8 border-t border-black border-opacity-50
`;
const MetricsGrid = styled.div`
  ${tw`grid gap-x-5 pt-8`};
  grid-template-columns: 380px 1fr 1fr;
`;
const Metric = tw.div`
  first:row-span-2 py-5 border-b border-black border-opacity-50 flex flex-col justify-between
`;
const MetricHeader = tw.div`flex items-baseline`;
const MetricHeading = styled(Heading)`
  font-size: 42px;
  ${tw`mb-5`};
`;
const MetricBigHeading = styled(Heading)`
  font-size: 100px;
  line-height: 1.08;
  ~ div {
    ${tw`font-semibold`};
    font-size: 42px;
    line-height: 1.375;
  }
`;
const MetricQuantifier = styled.div`
  ${tw`font-semibold ml-2`};
  font-size: 22px;
`;

const MetricDescription = styled.div`
  font-size: 22px;
  ${tw`flex items-center font-semibold`};
  > svg {
    ${tw`hover:cursor-pointer`}
    margin-left: 10px;
  }
`;
export default Hero;
