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
  onCancel: () => void;
  onSave: () => void;
};
const Settings: React.FC<SettingsProps> = ({ onCancel, onSave }) => {
  const {
    address,
    onboard,
    isConnected: isConnectedToWeb3,
    disconnect,
  } = useConnection();
  const [hasRemovedWallet, setHasRemovedWallet] = React.useState(false);
  const handleRemove = () => {
    setHasRemovedWallet(true);
  };
  const save = React.useCallback(() => {
    if (hasRemovedWallet) {
      disconnect();
    }
    onSave();
  }, [disconnect, hasRemovedWallet, onSave]);

  const walletName = onboard?.getState().wallet.name;
  const isConnected = hasRemovedWallet ? false : isConnectedToWeb3;
  return (
    <Wrapper>
      <Heading level={2}>Options Wallet</Heading>
      <Status>
        <ConnectionInfo>
          <Ping isConnected={isConnected} />
          <div>
            {isConnected ? `Connected with ${walletName}` : `Not connected`}
          </div>
        </ConnectionInfo>
        {isConnected && (
          <RemoveButton onClick={handleRemove}>Remove</RemoveButton>
        )}
      </Status>
      {isConnected && (
        <Info>
          <span>Account Name</span>
          <span>{address}</span>
        </Info>
      )}
      <ButtonWrapper>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={save}>Save</Button>
      </ButtonWrapper>
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
const RemoveButton = tw.button`underline text-primary`;
const ButtonWrapper = styled.div`
  ${tw`mt-8`}
  > ${Button} + ${Button} {
    margin-left: 10px;
  }
`;
