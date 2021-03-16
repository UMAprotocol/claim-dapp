import React from "react";
import tw, { styled } from "twin.macro";

import Button from "./Button";
import UnstyledHeading from "./Heading";
import { ButtonWrapper } from "./Wrappers";
import { Spinner } from "../assets/icons";
import { ReactComponent as UnstyledLogo } from "../assets/kpi-frame.svg";
import { useOptions, usePayouts } from "../hooks";
import { getOptionsDollarValue } from "../utils";

type ClaimProps = {
  onCancel?: () => void;
};
const expiryDate = "Jun 30 2021";
const Claim: React.FC<ClaimProps> = ({ onCancel }) => {
  const { claim: submitClaim, claims, txStatus, error } = useOptions();
  const payouts = usePayouts();
  const claim = claims && claims.length > 0 ? claims[0] : undefined;
  const claimed = claim?.hasClaimed;

  return (
    <Wrapper>
      <Header>
        <Logo dimmed={!Boolean(claimed)} />
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
            <Value>{payouts?.quantity ?? 0}</Value>
          </div>
          <div>
            <Label>Expiry</Label>
            <Value>{expiryDate}</Value>
          </div>
          <div>
            <Label>Current Payout</Label>
            <Value>{payouts?.currentPayout ?? "-"}</Value>
          </div>
          <div>
            <Label>Min. Payout</Label>
            <Value>{payouts?.minPayout ?? "-"}</Value>
          </div>
          <div>
            <Label>Max. Payout</Label>
            <Value>{payouts?.maxPayout ?? "-"}</Value>
          </div>
        </Metrics>
      </Content>
      <ButtonWrapper>
        {!claimed ? (
          <>
            <Button variant="secondary" onClick={onCancel}>
              Not Yet
            </Button>

            {txStatus === "pending" ? (
              <Button>
                Claiming... <LoadingIcon />
              </Button>
            ) : (
              <Button onClick={() => submitClaim()}>I'm Ready</Button>
            )}
          </>
        ) : (
          <Button onClick={onCancel}>Done</Button>
        )}
      </ButtonWrapper>
      {txStatus === "rejected" && <ErrorMessage>{error}</ErrorMessage>}
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
const ErrorMessage = tw.span`text-primary mt-3`;
const LoadingIcon = tw(Spinner)`animate-spin h-5 w-5 ml-3`;
