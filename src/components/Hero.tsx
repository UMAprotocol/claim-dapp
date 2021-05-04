import React from "react";
import tw, { styled, theme } from "twin.macro";

import {
  useConnection,
  useModal,
  useOptionsSupply,
  useTvl,
  useHasClaimed,
  useAddressInput,
} from "../hooks";
import {
  parseUSLocaleNumber,
  formatUSLocaleNumber,
  updateDefaultObject,
} from "../utils";
import Button from "./Button";
import { ReactComponent as Logo } from "../assets/kpi-frame.svg";
import { Settings as SettingsIcon } from "../assets/icons";
import { MaxWidthWrapper } from "./Wrappers";
import Heading from "./Heading";
import Modal from "./Modal";
import Settings from "./Settings";
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
};
type ClaimStatus = "selecting" | "selected";
const Hero: React.FC<HeroProps> = ({ onClaim, onClaimAddressSubmit }) => {
  const { isConnected } = useConnection();
  const { initOnboard } = useOnboard();
  const handleClaimClick = React.useCallback(() => {
    onClaim();
  }, [onClaim]);

  const handleConnectClick = React.useCallback(() => {
    initOnboard();
  }, [initOnboard]);
  const {
    modalRef: settingsModalRef,
    isOpen: isSettingsOpen,
    open: openSettings,
    close: closeSettings,
  } = useModal();
  const hasClaimed = useHasClaimed();

  const { data: tvlData, maxPayout, currentPayout } = useTvl();
  const { supply } = useOptionsSupply();
  const [metrics, setMetrics] = React.useState(Object.values(defaultMetrics));

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
  const [
    selectedAddressStatus,
    setSelectedAddressStatus,
  ] = React.useState<ClaimStatus>("selecting");

  const handleClaimAddressSubmit = React.useCallback(() => {
    if (isValidAddress && address !== null) {
      setSelectedAddressStatus("selected");
      onClaimAddressSubmit(address);
    }
  }, [address, isValidAddress, onClaimAddressSubmit]);

  const disableClaim = isConnected ? hasClaimed || !isValidAddress : false;

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
          <Label>
            <InputTitle level={3}>
              Check if an address has KPI Options
            </InputTitle>
            <Input
              placeholder="0x67C6Cf5288E5D8Bc474126949B3A50Cfe5512AF9"
              type="text"
              value={address}
              onChange={handleInputChange}
              isValid={isValidAddress}
            />
            {!isValidAddress && (
              <ErrorMsg>That doesn't look like a valid address...</ErrorMsg>
            )}
          </Label>
          <ButtonsWrapper>
            {selectedAddressStatus === "selecting" ? (
              <>
                <StyledButton variant="primary" onClick={handleConnectClick}>
                  Connect Wallet
                </StyledButton>
                <StyledButton
                  variant="secondary"
                  onClick={handleClaimAddressSubmit}
                  disabled={!isValidAddress || !address}
                >
                  Check for KPI Options
                </StyledButton>
              </>
            ) : (
              <>
                <StyledButton
                  onClick={handleClaimClick}
                  disabled={disableClaim}
                >
                  Claim Options
                </StyledButton>

                <StyledButton variant="secondary" onClick={openSettings}>
                  Connected <SettingsIcon />
                </StyledButton>
              </>
            )}
          </ButtonsWrapper>
          <Modal
            ref={settingsModalRef}
            isOpen={isSettingsOpen}
            onClose={closeSettings}
          >
            <Settings onComplete={closeSettings} />
          </Modal>
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
  ${tw`disabled:opacity-75 disabled:cursor-not-allowed`}
`;
const Label = styled.label`
  ${tw`w-full mx-auto relative mt-8 mb-2 md:(mt-12 mb-8) `}
  max-width: 500px;
`;
const InputTitle = tw(Heading)`
  text-lg md:(text-xl mb-2)
`;
const Input = styled.input<
  React.HTMLAttributes<HTMLInputElement> & { isValid: boolean }
>`
  ${tw`block bg-transparent mx-auto w-full placeholder-gray-500 rounded p-2 text-lg md:(rounded-lg px-2 pt-4 pb-3 text-xl)`};
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

export default Hero;
