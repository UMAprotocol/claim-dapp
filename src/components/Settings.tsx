import React from "react";
import tw, { styled } from "twin.macro";
import Button from "./Button";
import UnstyledHeading from "./Heading";

import { useConnection } from "../hooks";

type PingProps = { isConnected: boolean };
const PingOuter = tw.div`
  animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75
`;
const PingInner = styled.div<PingProps>`
  ${tw`relative inline-flex rounded-full w-1 h-1 bg-primary`};
  ${({ isConnected }) => (isConnected ? tw`bg-primary` : tw`bg-gray-darker`)};
`;
const PingWrapper = tw.div`relative mr-2 flex w-1 w-1`;
const Ping: React.FC<PingProps> = ({ isConnected }) => (
  <PingWrapper>
    {isConnected && <PingOuter />}
    <PingInner isConnected={isConnected} />
  </PingWrapper>
);

type SettingsProps = {
  onComplete: () => void;
};
const Settings: React.FC<SettingsProps> = ({ onComplete }) => {
  const { address, onboard, isConnected, disconnect } = useConnection();

  const handleRemove = React.useCallback(() => {
    disconnect();
    onComplete();
  }, [disconnect, onComplete]);

  const walletName = onboard?.getState().wallet.name;

  return (
    <Wrapper>
      <Heading level={2}>Options Wallet</Heading>
      <Status>
        <ConnectionInfo>
          <Ping isConnected={isConnected} />
          <div>Connected with {walletName}</div>
        </ConnectionInfo>
      </Status>
      {isConnected && (
        <Info>
          <span>Account Name</span>
          <span>{address}</span>
        </Info>
      )}

      <RemoveButton onClick={handleRemove}>Remove Address</RemoveButton>
    </Wrapper>
  );
};

export default Settings;

const Wrapper = tw.div`
  w-full flex flex-col items-stretch text-sm 
`;
const Heading = tw(UnstyledHeading)`
  text-lg text-center
`;
const Status = tw.div`
  flex justify-between mt-6
`;

const Info = tw.div`
  flex flex-col text-black text-opacity-50 mt-4 
`;

const ConnectionInfo = tw.div`flex items-center`;
const RemoveButton = tw(Button)`mt-8 mx-auto`;
