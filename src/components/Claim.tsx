import React from "react";
import tw, { styled } from "twin.macro";

import Button from "./Button";
import UnstyledHeading from "./Heading";
import { ButtonWrapper } from "./Wrappers";
import { ReactComponent as UnstyledLogo } from "../assets/kpi-frame.svg";
import { useClaim } from "../hooks";

type ClaimProps = {
  onCancel?: () => void;
};

const Claim: React.FC<ClaimProps> = ({ onCancel }) => {
  const { claim, claimed } = useClaim();

  return (
    <Wrapper>
      <Header>
        <Logo dimmed={!claimed} />
        <Heading level={1}>
          {claimed
            ? "Your options have been claimed."
            : "Ready to claim your options?"}
        </Heading>
      </Header>
      <Content>
        <OptionName>uTVL-Jun 30</OptionName>
        <Metrics>
          <div>
            <Label>Quantity</Label>
            <Value>100</Value>
          </div>
          <div>
            <Label>Expiry</Label>
            <Value>June 30, 2021</Value>
          </div>
          <div>
            <Label>Current Payout</Label>
            <Value>$1000</Value>
          </div>
          <div>
            <Label>Min. Payout</Label>
            <Value>$2368</Value>
          </div>
          <div>
            <Label>Max. Payout</Label>
            <Value>$74,360</Value>
          </div>
        </Metrics>
      </Content>
      <ButtonWrapper>
        {!claimed ? (
          <>
            <Button variant="secondary" onClick={onCancel}>
              Not Yet
            </Button>
            <Button onClick={claim}>I'm Ready</Button>
          </>
        ) : (
          <Button onClick={onCancel}>Done</Button>
        )}
      </ButtonWrapper>
    </Wrapper>
  );
};
export default Claim;

const Wrapper = tw.div`w-full flex flex-col items-stretch text-sm mt-3`;
const Header = tw.header`flex flex-col items-center justify-center`;
const Content = tw.div`mt-10 divide-y divide-gray`;
const Heading = tw(UnstyledHeading)`text-xl text-center leading-relaxed mt-6`;
const OptionName = styled(UnstyledHeading)`
  font-size: 1.75rem;
  margin-bottom: 10px;
`;
const Metrics = tw.div`
    grid grid-cols-2 gap-x-3 gap-y-5 mb-10 pt-5
`;
const Value = tw.div``;
const Label = tw.div`text-gray capitalize`;
const Logo = styled(UnstyledLogo)<{ dimmed: boolean }>`
  circle {
    fill: ${({ dimmed }) => (dimmed ? "#F29797" : "#FF4A4A")};
  }
`;
