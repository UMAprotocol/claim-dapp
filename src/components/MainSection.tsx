import React from "react";
import tw from "twin.macro";

import { MaxWidthWrapper } from "./Wrappers";
import { Section, AccentSection } from "./Section";
import Modal from "./Modal";
import Hero from "./Hero";
import KPIOptions from "./KPIOptions";
import OptionsList from "./OptionsList";

import Claim from "./Claim";

import { useModal } from "../hooks";

const MainSection: React.FC = () => {
  const {
    modalRef: claimModalRef,
    isOpen: isClaimOpen,
    open: openClaim,
    close: closeClaim,
  } = useModal();
  const [accountToClaim, setAccountToClaim] = React.useState<string>();

  const handleAddressSubmit = React.useCallback((address: string) => {
    setAccountToClaim(address);
  }, []);

  return (
    <>
      <AccentSection>
        <Hero
          onClaim={openClaim}
          onClaimAddressSubmit={handleAddressSubmit}
          accountToClaim={accountToClaim}
        />
      </AccentSection>
      <Section>
        <MaxWidthWrapper>
          <OptionsWrapper>
            <KPIOptions onClaim={openClaim} accountToClaim={accountToClaim} />
            <OptionsList />
          </OptionsWrapper>
        </MaxWidthWrapper>
      </Section>
      {accountToClaim && (
        <Modal ref={claimModalRef} isOpen={isClaimOpen} onClose={closeClaim}>
          <Claim onCancel={closeClaim} accountToClaim={accountToClaim} />
        </Modal>
      )}
    </>
  );
};

export default MainSection;
const OptionsWrapper = tw.div`
    px-10 py-20 grid grid-cols-1 md:grid-cols-2 gap-10
`;
