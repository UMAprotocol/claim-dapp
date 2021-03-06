import React from "react";
import tw from "twin.macro";

import { MaxWidthWrapper } from "./Wrappers";
import { Section, AccentSection } from "./Section";
import Modal from "./Modal";
import ClaimHero from "./ClaimHero";
import KPIOptions from "./KPIOptions";
import OptionsList from "./OptionsList";
import RedeemHero from "./RedeemHero";

import Claim from "./Claim";
import Redeem from "./Redeem";

import { useModal } from "../hooks";
import { hasExpired } from "../config";

export type ClaimPhase = "redeem" | "claim";
const claimPhase: ClaimPhase = hasExpired ? "redeem" : "claim";

const MainSection: React.FC = () => {
  const { isOpen, open, close } = useModal();
  const [accountToClaim, setAccountToClaim] = React.useState<string>();

  const handleAddressSubmit = React.useCallback((address: string) => {
    setAccountToClaim(address);
  }, []);

  return (
    <>
      <AccentSection>
        {claimPhase === "claim" ? (
          <ClaimHero
            onClaim={open}
            onClaimAddressSubmit={handleAddressSubmit}
            accountToClaim={accountToClaim}
          />
        ) : (
          <RedeemHero onRedeem={open} />
        )}
      </AccentSection>
      <Section>
        <MaxWidthWrapper>
          <OptionsWrapper>
            <KPIOptions
              onClaim={open}
              accountToClaim={accountToClaim}
              claimPhase={claimPhase}
            />
            <OptionsList />
          </OptionsWrapper>
        </MaxWidthWrapper>
      </Section>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={close}>
          {claimPhase === "claim" ? (
            <Claim onCancel={close} accountToClaim={accountToClaim!} />
          ) : (
            <Redeem onCancel={close} />
          )}
        </Modal>
      )}
    </>
  );
};

export default MainSection;
const OptionsWrapper = tw.div`
    px-10 py-20 grid grid-cols-1 md:grid-cols-2 gap-10
`;
