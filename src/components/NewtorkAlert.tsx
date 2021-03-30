import React from "react";
import tw from "twin.macro";
import Portal from "./Portal";
import { useConnection } from "../hooks";
import { SUPPORTED_NETWORK_IDS } from "../config";

const Alert: React.FC = () => {
  const { isConnected, network } = useConnection();

  const isNetworkUnsupported =
    isConnected &&
    network &&
    !SUPPORTED_NETWORK_IDS.includes(network.chainId as 1 | 42);
  if (!isNetworkUnsupported) {
    return null;
  }
  return (
    isNetworkUnsupported && (
      <Portal>
        <BgBlur />
        <Aside>
          🚨 This Dapp will only work on Mainnet and Kovan. Please change
          network and refresh the page. 🚨
        </Aside>
      </Portal>
    )
  );
};

const Aside = tw.aside`
    text-center text-white text-xl font-semibold p-8 fixed top-0 left-0 right-0 bg-black border-primary
`;
const BgBlur = tw.div`
  fixed inset-0 bg-black bg-opacity-50
`;
export default Alert;
