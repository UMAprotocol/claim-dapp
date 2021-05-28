import React from "react";
import tw, { styled } from "twin.macro";

import { MaxWidthWrapper } from "./Wrappers";
import UnstyledHeading from "./Heading";
import Button from "./Button";
import { Metric } from "./Metrics";
import { ReactComponent as Logo } from "../assets/kpi-frame.svg";
import { useConnection, useOnboard, useOptionsBalance } from "../hooks";
import { expirationTvl as rawExpirationTvl, expirationPayout } from "../config";
import { formatUSLocaleNumber } from "../utils";

const expirationTvl = formatUSLocaleNumber(
  Number(rawExpirationTvl) / 10 ** 6,
  1,
  "USD"
);

type Props = {
  onRedeem: () => void;
};
const RedeemHero: React.FC<Props> = ({ onRedeem }) => {
  const { account, isConnected } = useConnection();
  const { initOnboard } = useOnboard();
  const handleCTAClick = React.useCallback(() => {
    if (isConnected) {
      onRedeem();
    } else {
      initOnboard();
    }
  }, [isConnected, onRedeem, initOnboard]);

  const { balance } = useOptionsBalance(account);

  const redeemError = Boolean(balance && parseFloat(balance) === 0);

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
            <StyledButton onClick={handleCTAClick} disabled={redeemError}>
              {isConnected ? "Redeem Options" : "Connect Wallet"}
            </StyledButton>
          </ButtonsWrapper>
          {redeemError && <ErrorMsg>You have no options to redeem.</ErrorMsg>}
        </CTAWrapper>
        <MetricsWrapper>
          <StyledMetric
            metric={{
              value: expirationTvl,
              description: "UMA TVL",
              quantifier: "Million",
              extendedDescription: (
                <p>
                  The value of <strong>UMA TVL</strong> when KPI options
                  expired.
                </p>
              ),
            }}
            big
          />
          <StyledMetric
            big
            metric={{
              value: `${expirationPayout}`,
              description: "Payout at expiry.",
              quantifier: "UMA",
              extendedDescription: (
                <p>
                  The value of 1 <strong>uTVL</strong> token
                </p>
              ),
            }}
          />
        </MetricsWrapper>
      </Wrapper>
    </MaxWidthWrapper>
  );
};

export default RedeemHero;
const Wrapper = styled.div`
  ${tw`pb-10 px-20 pt-5`};
`;
const CTAWrapper = tw.div`flex flex-col items-center`;
const TitleWrapper = tw.div`flex`;
const Title = tw(
  UnstyledHeading
)`text-5xl md:text-7xl leading-snug ml-7 flex-1`;
const KPILogo = styled(Logo)`
  min-width: 36px;
`;
const Subtitle = tw.span`text-xl leading-relaxed`;
const ButtonsWrapper = styled.div`
  ${tw`w-full flex justify-center items-center`};
  margin-top: 10px;
  max-width: 500px;
  & > * + * {
    margin-left: 10px;
  }
`;
const StyledButton = styled(Button)`
  padding: 6px 0;
  flex: 1;
  max-width: 300px;
  ${tw`disabled:opacity-75 disabled:cursor-not-allowed`}
`;

const MetricsWrapper = tw.div`
 w-full mt-8 border-t border-black border-opacity-50 grid grid-cols-1 md:grid-cols-2 justify-items-center
`;

const StyledMetric = styled(Metric)`
  width: fit-content;
`;
const ErrorMsg = tw.span`text-left mt-4`;
