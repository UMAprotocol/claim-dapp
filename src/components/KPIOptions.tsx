import React from "react";
import tw, { styled } from "twin.macro";

import { useConnection, useModal, usePayouts, useTvl } from "../hooks";
import Heading from "./Heading";
import Button from "./Button";
import ProgressBar from "./ProgressBar";
import Modal from "./Modal";
import Claim from "./Claim";
import Expiry from "./Expiry";
import InfoList, { InfoProps } from "./InfoList";
import { expiryDate } from "../config";

const defaultInfos: Record<string, InfoProps> = {
  quantity: {
    label: "Quantity",
    value: "Claim to reveal",
  },
  expiry: {
    label: "Expiry",
    value: expiryDate,
  },
  minPayout: {
    label: "Min. Payout",
    value: "-",
    description: (
      <span>
        The minimum amount of UMA all of your uTVL-JUN options will be worth
      </span>
    ),
  },
  currentPayout: {
    label: "Current Payout",
    value: "-",
    description: (
      <span>
        The current amount of UMA all of your uTVL-JUN options are worth
      </span>
    ),
  },
  maxPayout: {
    label: "Max. Payout",
    value: "-",
    description: (
      <span>
        The maximum amount of UMA all of your uTVL-JUN options can be worth if
        UMA’s TVL reaches $2 billion
      </span>
    ),
  },
};
const KPIOptions: React.FC = () => {
  const { isConnected } = useConnection();
  const { isOpen, open, close, modalRef } = useModal();
  const { data: tvlData } = useTvl();
  const values = usePayouts();

  const tvl = tvlData?.currentTvl;
  const infos = React.useMemo(() => updateInfos(values), [values]);
  const handleClick = React.useCallback(() => {
    open();
  }, [open]);

  return (
    <Wrapper>
      <MainHeading level={3}>Your KPI Options</MainHeading>
      <Content>
        <ContentHeader>
          <OptionName>uTVL-Jun 30</OptionName>
          <ClaimButton onClick={handleClick} disabled={!isConnected}>
            Claim Options
          </ClaimButton>
        </ContentHeader>
        <ContentMain>
          <ProgressBar
            max={2000}
            current={Number(tvl ?? 0.15 * 10 ** 9) / 10 ** 6}
            description="UMA’s current TVL"
          />
          <InfoList infos={Object.values(infos)} />
        </ContentMain>
        <Expiry
          expiryDate={expiryDate}
          description="Redeem uTVL-JUN tokens for UMA tokens at expiry"
        />
      </Content>
      <Modal isOpen={isOpen} onClose={close} ref={modalRef}>
        <Claim onCancel={close} />
      </Modal>
    </Wrapper>
  );
};
export default KPIOptions;
const Wrapper = tw.div`w-full`;
const MainHeading = styled(Heading)`
  font-size: 2rem;
  ${tw`text-center mb-5`}
`;
const OptionName = styled.div`
  font-size: 28px;
`;
const ClaimButton = styled(Button)`
  padding: 15px 50px;
  ${tw`disabled:opacity-75 disabled:cursor-not-allowed`}
`;
const Content = tw.div`
    border-b border-t border-gray 
 `;
const ContentHeader = tw.div`
    flex justify-between items-center bg-gray-darkest p-5
`;
const ContentMain = tw.div`p-5`;

function updateInfos(values: { [key: string]: unknown } | undefined) {
  return values
    ? Object.keys(defaultInfos).reduce((obj, key) => {
        const value = values[key] || defaultInfos[key].value;
        return { ...obj, [key]: { ...defaultInfos[key], value } };
      }, {})
    : defaultInfos;
}
