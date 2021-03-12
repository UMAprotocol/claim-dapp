import React from "react";
import tw, { styled } from "twin.macro";

import { useConnection, useCountdown, Time, useModal } from "../hooks";
import { Info as UnstyledInfo } from "../assets/icons";
import Heading from "./Heading";
import Button from "./Button";
import ProgressBar from "./ProgressBar";
import Modal from "./Modal";
import Claim from "./Claim";

const DateCounter: React.FC<{ date: Time }> = ({ date }) => {
  const { days, hours, minutes, seconds } = useCountdown(date);

  return (
    <DateCounterWrapper>
      <DateCounterGrid>
        <DateCounterItem>{days}</DateCounterItem>
        <DateCounterItem>{hours}</DateCounterItem>
        <DateCounterItem>{minutes}</DateCounterItem>
        <DateCounterItem>{seconds}</DateCounterItem>
      </DateCounterGrid>
      <DateCounterLabels>
        <div>days</div>
        <div>hours</div>
        <div>min.</div>
        <div>sec.</div>
      </DateCounterLabels>
    </DateCounterWrapper>
  );
};

const DateCounterItem = styled.div`
  ${tw`px-3 py-1 bg-gray-dark first:rounded-tl first:rounded-bl last:rounded-tr last:rounded-br`};
  font-size: 22px;
`;
const DateCounterGrid = tw.div`
    grid grid-cols-4 divide-x 
`;
const DateCounterLabels = tw.div`grid grid-cols-4 capitalize`;
const DateCounterWrapper = styled.div`
  ${tw`grid grid-rows-2 text-center`};
  grid-row-gap: 10px;
`;

const expiryDate = "Jun 30 2021";
const KPIOptions: React.FC = () => {
  const { isConnected } = useConnection();
  const { isOpen, open, close, modalRef } = useModal();
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
            {isConnected ? "Claim Options" : "Redeem Options"}
          </ClaimButton>
        </ContentHeader>
        <ContentMain>
          <ProgressBar max={20} current={3} />
          <InfoWrapper>
            <Info>
              <InfoLabel>Quantity</InfoLabel>
              <span>Claim to Reveal</span>
            </Info>
            <Info>
              <InfoLabel>Expiry</InfoLabel>
              <span>December 30, 2021</span>
            </Info>
            <div></div>
            <Info>
              <InfoLabel>
                Min. Payout <InfoIcon />
              </InfoLabel>
              <span>-</span>
            </Info>
            <Info>
              <InfoLabel>
                Current Payout <InfoIcon />
              </InfoLabel>
              <span>-</span>
            </Info>
            <Info>
              <InfoLabel>
                Max. Payout <InfoIcon />
              </InfoLabel>
              <span>-</span>
            </Info>
          </InfoWrapper>
        </ContentMain>
        <ExpiryWrapper>
          <ExpiryHeading level={6}>
            Options expire in: <InfoIcon />
          </ExpiryHeading>
          <DateCounter date={expiryDate} />
        </ExpiryWrapper>
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
const InfoWrapper = tw.div`mt-5  grid grid-cols-3 grid-rows-2 gap-5`;
const Info = tw.div`flex flex-col text-lg`;
const InfoLabel = styled.span`
  ${tw`text-gray flex `}
`;
const InfoIcon = styled(UnstyledInfo)`
  ${tw`relative top-1 hover:cursor-pointer`};
  margin-left: 10px;
`;
const ExpiryWrapper = tw.div`
    flex flex-col bg-gray-darkest p-5
`;
const ExpiryHeading = styled(Heading)`
  ${tw`flex text-lg`};
  margin-bottom: 10px;
`;
