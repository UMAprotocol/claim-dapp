import React from "react";
import tw, { styled, theme } from "twin.macro";

import {
  useConnection,
  useOptionsSupply,
  useTvl,
  useHasClaimed,
  useAddressInput,
  usePayouts,
} from "../hooks";
import {
  parseUSLocaleNumber,
  formatUSLocaleNumber,
  updateDefaultObject,
} from "../utils";
import Button from "./Button";
import { ReactComponent as Logo } from "../assets/kpi-frame.svg";
import { Spinner as SpinnerIcon } from "../assets/icons";
import { MaxWidthWrapper } from "./Wrappers";
import Heading from "./Heading";
import Link from "./Link";
import Metrics from "./Metrics";
import { optionsName } from "../config";
import { useOnboard } from "../hooks/useOnboard";

const MoreInfoLink = tw(Link)`
  text-xl no-underline
`;
const defaultMetrics = {
  tvl: {
    value: "$0",
    quantifier: "Million",
    description: (
      <div>
        <div>UMA’s Total Value Locked (TVL)</div>
        <MoreInfoLink
          href="https://monitor.simpleid.xyz/d/x4CYPILGk/uma?orgId=1"
          target="_blank"
          rel="noopener norefferrer"
        >
          More Info
        </MoreInfoLink>
      </div>
    ),
  },
  maxReward: {
    value: "0",
    quantifier: "UMA",
    description: "Maximum reward",
    extendedDescription: (
      <p>
        The <strong>maximum</strong> amount of <strong>UMA</strong> tokens that
        will be redeemable by <strong>{optionsName}</strong> token holders If
        UMA’s TVL reaches <strong>$2 billion</strong>
      </p>
    ),
  },
  currentReward: {
    value: "0",
    quantifier: "UMA",
    description: "Current expected reward",
    extendedDescription: (
      <p>
        The <strong>expected</strong> amount of <strong>UMA</strong> tokens that
        will be redeemable by <strong>{optionsName}</strong> token holders based
        on <strong>UMA’s current TVL</strong>
      </p>
    ),
  },
  supply: {
    value: "0",
    description: "KPI options in circulation",
    extendedDescription: (
      <p>
        The total amount of <strong>{optionsName}</strong> options in{" "}
        <strong> circulation</strong>
      </p>
    ),
  },
  multiplier: {
    value: "0x",
    description: "Current option multiplier",
    extendedDescription: (
      <p>
        Used to calculate the amount of <strong>UMA</strong> each{" "}
        <strong>{optionsName}</strong> option is worth; the higher{" "}
        <strong>UMA’s TVL</strong>, the higher the <strong>multiplier</strong>
      </p>
    ),
  },
};
type HeroProps = {
  onClaim: () => void;
  onClaimAddressSubmit: (address: string) => void;
  accountToClaim?: string;
};

const ClaimHero: React.FC<HeroProps> = ({
  onClaim,
  onClaimAddressSubmit,
  accountToClaim,
}) => {
  const { isConnected } = useConnection();
  const { initOnboard } = useOnboard();

  const { hasClaimed, isLoading: isLoadingClaims } =
    useHasClaimed(accountToClaim);

  const handleCTAClick = React.useCallback(() => {
    if (isConnected) {
      onClaim();
    } else {
      initOnboard();
    }
  }, [isConnected, onClaim, initOnboard]);

  const { data: tvlData, maxPayout, currentPayout } = useTvl();
  const { supply } = useOptionsSupply();
  const [metrics, setMetrics] = React.useState(Object.values(defaultMetrics));
  const { quantity } = usePayouts(accountToClaim);
  const currentTvl = tvlData?.currentTvl;
  React.useEffect(() => {
    const tvlInMilions = currentTvl
      ? formatUSLocaleNumber(Number(currentTvl) / 10 ** 6, 1, "USD")
      : undefined;

    const maxReward = supply
      ? formatUSLocaleNumber(parseUSLocaleNumber(supply) * maxPayout, 0)
      : undefined;
    const currentReward = supply
      ? formatUSLocaleNumber(
          parseUSLocaleNumber(supply) * Number(currentPayout),
          0
        )
      : undefined;

    const formattedSupply = formatUSLocaleNumber(Number(supply) || 100000, 0);

    const multiplier = `${currentPayout}x`;
    const freshMetrics = {
      tvl: { value: tvlInMilions },
      supply: { value: formattedSupply },
      maxReward: { value: maxReward },
      currentReward: { value: currentReward },
      multiplier: { value: multiplier },
    };
    const newMetrics = updateDefaultObject(defaultMetrics, freshMetrics) as any;
    setMetrics(Object.values(newMetrics));
  }, [currentPayout, currentTvl, maxPayout, supply]);

  // handle the input
  const { address, updateAddress, isValid: isValidAddress } = useAddressInput();
  const handleInputChange = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      updateAddress(evt.target.value);
    },
    [updateAddress]
  );

  const handleClaimAddressSubmit = React.useCallback(() => {
    if (isValidAddress && Boolean(address)) {
      onClaimAddressSubmit(address);
    }
  }, [address, isValidAddress, onClaimAddressSubmit]);

  const disableClaim =
    hasClaimed || isLoadingClaims || accountToClaim == null || quantity === 0;
  let claimMsg;
  if (hasClaimed) {
    claimMsg = "Options for this address have already been claimed.";
  } else if (quantity === 0 && accountToClaim != null && !isLoadingClaims) {
    claimMsg = "There are no options to claim for this address.";
  } else {
    claimMsg = undefined;
  }

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
          <OptionsBadge>
            <h3>KPI Options breakdown</h3>
            <div>
              {quantity} {optionsName}
            </div>
          </OptionsBadge>
          <Label>
            <InputTitle level={3}>Recipient</InputTitle>
            <Input
              placeholder="Your Address here"
              type="text"
              value={address}
              onChange={handleInputChange}
              isValid={isValidAddress}
              disabled={!isConnected}
            />
            {!isValidAddress && (
              <ErrorMsg>That doesn't look like a valid address...</ErrorMsg>
            )}
          </Label>
          <ButtonsWrapper>
            <StyledButton
              onClick={handleCTAClick}
              disabled={isConnected ? disableClaim : false}
            >
              {isConnected ? "Claim Options" : "Connect Wallet"}
            </StyledButton>
            {isConnected && (
              <StyledButton
                variant="secondary"
                onClick={handleClaimAddressSubmit}
                disabled={!address}
              >
                Check for KPI Options {isLoadingClaims && <LoadingIcon />}
              </StyledButton>
            )}
          </ButtonsWrapper>
          {claimMsg && <ClaimErrorMsg>{claimMsg}</ClaimErrorMsg>}
        </CTAWrapper>
        <Metrics metrics={metrics} />
      </Wrapper>
    </MaxWidthWrapper>
  );
};

const Wrapper = styled.div`
  ${tw`pb-10 px-20 pt-5`};
`;
const CTAWrapper = tw.div`flex flex-col items-center`;
const TitleWrapper = tw.div`flex`;
const Title = tw(Heading)`text-5xl md:text-7xl leading-snug ml-7 flex-1`;
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
const OptionsBadge = styled.div`
  ${tw`w-full mx-auto relative mt-8 mb-2 p-2 rounded md:(mt-12 mb-8 px-4 pt-4 pb-3 rounded-lg) bg-black text-white`}
  max-width: 500px;
  & > div {
    ${tw`text-xl text-secondary md:(text-3xl mt-4)`}
  }
`;
const Label = styled.label`
  ${tw`w-full mx-auto relative mt-4 mb-2 md:(mt-4 mb-8) `}
  max-width: 500px;
`;
const InputTitle = tw(Heading)`
  text-lg md:(text-xl mb-2)
`;
const Input = styled.input<
  React.HTMLAttributes<HTMLInputElement> & { isValid: boolean }
>`
  ${tw`block bg-transparent mx-auto w-full placeholder-gray-500 placeholder-opacity-50 rounded p-2 text-lg md:(rounded-lg px-2 pt-4 pb-3 text-xl) disabled:(border-gray-500 cursor-not-allowed)`};
  outline-offset: 2px;
  border-width: 2px;
  border-style: solid;
  border-color: ${(p) =>
    !p.isValid ? theme`colors.primary` : theme`colors.black`};
  @media (min-width: ${theme`screens.md`}) {
    outline-offset: 6px;
    border-width: 3px;
  }
`;
const ErrorMsg = tw.span`
  text-primary`;
const LoadingIcon = tw(SpinnerIcon)`animate-spin h-5 w-5 ml-3`;
const ClaimErrorMsg = tw.span`text-left mt-4`;
export default ClaimHero;
