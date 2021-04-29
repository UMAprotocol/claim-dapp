import { useConnection } from "../hooks";
import { isValidChainId } from "../utils/chainId";

export function useNetworkCheck(): boolean {
  const { isConnected, chainId } = useConnection();

  return !isConnected || Boolean(chainId && isValidChainId(chainId));
}
