import React from "react";
import tw, { styled } from "twin.macro";

import {
  useConnection,
  useModal,
  useOptionsSupply,
  useTvl,
  useOptionsClaim,
} from "../hooks";
import {
  parseUSLocaleNumber,
  formatUSLocaleNumber,
  updateDefaultObject,
} from "../utils";
import Button from "./Button";
import { ReactComponent as KPILogo } from "../assets/kpi-frame.svg";
import { Settings as SettingsIcon } from "../assets/icons";
import { MaxWidthWrapper } from "./Wrappers";
import Heading from "./Heading";
import Modal from "./Modal";
import Settings from "./Settings";
import Claim from "./Claim";
import Metrics from "./Metrics";
import Link from "./Link";
import { optionsName } from "../config";
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
    value: "2,000,000",
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
    value: "325,000",
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
    value: "100,000",
    description: "KPI options in circulation",
    extendedDescription: (
      <p>
        The total amount of <strong>{optionsName}</strong> options in{" "}
        <strong> circulation</strong>
      </p>
    ),
  },
  multiplier: {
    value: "1x",
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

const Hero: React.FC = () => {
  const { isConnected, connect } = useConnection();
  const {
    modalRef: claimModalRef,
    isOpen: isClaimOpen,
    open: openClaim,
    close: closeClaim,
  } = useModal();
  const handleCTAClick = React.useCallback(() => {
    if (isConnected) {
      openClaim();
    } else {
      connect();
    }
  }, [connect, isConnected, openClaim]);
  const {
    modalRef: settingsModalRef,
    isOpen: isSettingsOpen,
    open: openSettings,
    close: closeSettings,
  } = useModal();
  const { claims } = useOptionsClaim();
  const claim = claims && claims.length > 0 ? claims[0] : undefined;
  const claimed = Boolean(claim?.hasClaimed);
  const disableClaim = claimed && isConnected;

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
            <StyledButton onClick={handleCTAClick} disabled={disableClaim}>
              {isConnected
                ? "Claim Options"
                : "Connect Wallet to Claim Options"}
            </StyledButton>
            {isConnected && (
              <StyledButton variant="secondary" onClick={openSettings}>
                Connected <SettingsIcon />
              </StyledButton>
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
      <Modal ref={claimModalRef} isOpen={isClaimOpen} onClose={closeClaim}>
        <Claim onCancel={closeClaim} />
      </Modal>
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
  ${tw`disabled:opacity-75 disabled:cursor-not-allowed`}
`;

export default Hero;
