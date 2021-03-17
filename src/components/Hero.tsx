import React from "react";
import tw, { styled } from "twin.macro";

import { useConnection, useModal } from "../hooks";
import Button from "./Button";
import { ReactComponent as KPILogo } from "../assets/kpi-frame.svg";
import { Settings as SettingsIcon } from "../assets/icons";
import { MaxWidthWrapper } from "./Wrappers";
import Heading from "./Heading";
import Modal from "./Modal";
import Settings from "./Settings";
import Claim from "./Claim";
import Metrics from "./Metrics";

const metrics = [
  {
    value: "$105.3",
    quantifier: "Million",
    description: "UMA’s Total Value Locked (TVL)",
  },
  {
    value: "2,000,000",
    quantifier: "UMA",
    description: "Maximum reward",
    extendedDescription: (
      <p>
        The maximum amount of UMA tokens that will be redeemable by uTVL-JUN
        token holders If UMA’s TVL reaches $2 billion
      </p>
    ),
  },
  {
    value: "325,000",
    quantifier: "UMA",
    description: "Current expected reward",
    extendedDescription: (
      <p>
        The expected amount of UMA tokens that will be redeemable by uTVL-JUN
        token holders based on UMA’s current TVL
      </p>
    ),
  },
  {
    value: "100,000",
    description: "KPI options in circulation",
    extendedDescription: (
      <p>The total amount of uTVL-JUN options in circulation</p>
    ),
  },
  {
    value: "3.25x",
    description: "Current option multiplier",
    extendedDescription: (
      <p>
        Used to calculate the amount of UMA each uTVL-JUN option is worth; the
        higher UMA’s TVL, the higher the multiplier
      </p>
    ),
  },
];

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
            <Settings onCancel={closeSettings} onSave={closeSettings} />
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
`;

export default Hero;
