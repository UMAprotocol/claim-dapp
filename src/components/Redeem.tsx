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
  useRedeem,
  useConnection,
  useLatestTransaction,
  useOptionsBalance,
} from "../hooks";
import { etherscanUrlFromTx, formatMillions } from "../utils";
import { splitAddress } from "../utils/address";
import {
  expiryDate,
  expirationTvl,
  expirationPayout,
  optionsName,
} from "../config";

type Props = { onCancel: () => void };
const Redeem: React.FC<Props> = ({ onCancel }) => {
  const { account } = useConnection();
  const { redeemCallback, error } = useRedeem();
  const { transaction: tx, state: txState } = useLatestTransaction();

  const logoRef = React.useRef<SVGSVGElement>(null);
  const { balance } = useOptionsBalance(account);

  return (
    <Wrapper>
      <Header>
        <div>
          <Logo
            dimmed={txState?.status !== "loading" ? 1 : undefined}
            ref={logoRef}
          />
          {txState?.status === "success" && tx?.label === "redeem" && (
            <Confetto anchorRef={logoRef} />
          )}
        </div>
        <Heading level={1}>
          {txState?.status === "success" && tx?.label === "redeem"
            ? "Your options have been redeemed."
            : "Ready to redeem your options?"}
        </Heading>
      </Header>
      <Content>
        <OptionName>{optionsName}</OptionName>
        <Metrics>
          <div>
            <Label>Quantity</Label>
            <Value>
              {balance ?? "-"} <Unit>{optionsName}</Unit>
            </Value>
          </div>
          <div>
            <Label>Expiry</Label>
            <Value>{expiryDate}</Value>
          </div>
          <div>
            <Label>Payout</Label>
            <Value>
              {expirationPayout ?? "-"} <Unit>UMA</Unit>
            </Value>
          </div>
          <div>
            <Label>TVL at expiry</Label>
            <Value>
              {expirationTvl ? formatMillions(expirationTvl / 10 ** 6) : "-"}
            </Value>
          </div>

          <div>
            <Label>Account</Label>
            <Value>{splitAddress(account!)}</Value>
          </div>
        </Metrics>
      </Content>
      <ButtonWrapper>
        {txState?.status !== "success" || tx?.label === "approve" ? (
          <>
            <Button variant="secondary" onClick={onCancel}>
              Not Yet
            </Button>

            {txState?.status === "loading" ? (
              <Button>
                {tx?.label === "redeem" ? "Reediming..." : "Approving..."}
                <LoadingIcon />
              </Button>
            ) : (
              <Button onClick={() => redeemCallback()}>I'm Ready</Button>
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
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Wrapper>
  );
};

export default Redeem;

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
