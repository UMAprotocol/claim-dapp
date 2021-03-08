import React from "react";
import tw from "twin.macro";

import Button from "./Button";
import { useConnection } from "../hooks";

const Navbar: React.FC = () => {
  const { connect, address, signer, network } = useConnection();
  return (
    <Container>
      <code>
        <pre>{JSON.stringify({ address, signer, network }, null, 2)}</pre>
      </code>
      <ConnectButton onClick={connect}>Connect</ConnectButton>
    </Container>
  );
};

const Container = tw.div`flex justify-between w-full border-b p-4 shadow-md`;
const ConnectButton = tw(Button)`
    p-2 bg-red-500 
`;
export default Navbar;
