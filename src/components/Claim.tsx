import React from "react";
import tw, { styled } from "twin.macro";

import Button from "./Button";
import UnstyledHeading from "./Heading";
import { ButtonWrapper } from "./Wrappers";
import Confetto from "./Confetti";
import Link from "./Link";
import { Spinner, ExternalLink } from "../assets/icons";
import { ReactComponent as UnstyledLogo } from "../assets/kpi-frame.svg";
import {
  useOptions,
  usePayouts,
  useHasClaimed,
  useTransactions,
} from "../hooks";
import { etherscanUrlFromTx } from "../utils";
import { expiryDate, optionsName } from "../config";
type ClaimProps = {
  onCancel?: () => void;
};

const Claim: React.FC<ClaimProps> = ({ onCancel }) => {
  const { claimCallback: submitClaim, error } = useOptions();
  const { transaction: tx, status: txStatus } = useTransactions();
  const payouts = usePayouts();
  const logoRef = React.useRef<SVGSVGElement>(null);
  const hasClaimed = useHasClaimed();

  return (
    <Wrapper>
      <Header>
        <div>
          <Logo dimmed={!hasClaimed ? 1 : undefined} ref={logoRef} />
          {hasClaimed && <Confetto anchorRef={logoRef} />}
        </div>
        <Heading level={1}>
          {hasClaimed
            ? "Your options have been claimed."
            : "Ready to claim your options?"}
        </Heading>
      </Header>
      <Content>
        <OptionName>{optionsName}</OptionName>
        <Metrics>
          <div>
            <Label>Quantity</Label>
            <Value>
              {payouts?.quantity ?? 0} <Unit>{optionsName}</Unit>
            </Value>
          </div>
          <div>
            <Label>Expiry</Label>
            <Value>{expiryDate}</Value>
          </div>
          <div>
            <Label>Current Payout</Label>
            <Value>
              {payouts?.currentPayout ?? "-"} <Unit>UMA</Unit>
            </Value>
          </div>
          <div>
            <Label>Min. Payout</Label>
            <Value>
              {payouts?.minPayout ?? "-"} <Unit>UMA</Unit>
            </Value>
          </div>
          <div>
            <Label>Max. Payout</Label>
            <Value>
              {payouts?.maxPayout ?? "-"} <Unit>UMA</Unit>
            </Value>
          </div>
        </Metrics>
      </Content>
      <ButtonWrapper>
        {!hasClaimed ? (
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
      {tx && tx.hash && (
        <EtherscanLink
          href={etherscanUrlFromTx(tx as any)}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Etherscan <LinkIcon />
        </EtherscanLink>
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
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
const Logo = styled(UnstyledLogo)<{ dimmed?: 1 }>`
  circle {
    fill: ${({ dimmed }) => (dimmed ? "#F29797" : "#FF4A4A")};
  }
`;
const ErrorMessage = tw.span`text-primary mt-3`;
const LoadingIcon = tw(Spinner)`animate-spin h-5 w-5 ml-3`;
const EtherscanLink = tw(
  Link
)`mt-4 p-2 text-primary text-right hover:underline`;
const LinkIcon = tw(ExternalLink)`w-3 h-3 inline-block`;
const Unit = tw.span`text-gray text-sm font-light ml-1`;
