import { useConnection } from "../hooks";
import { SUPPORTED_NETWORK_IDS } from "../config";

export function useNetworkCheck() {
  const { isConnected, network } = useConnection();

  return (
    !isConnected || (network && SUPPORTED_NETWORK_IDS.includes(network.chainId))
  );
}
