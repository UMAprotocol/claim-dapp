import React from "react";
import { isValidAddress } from "../utils/address";
import { useConnection } from "./useConnection";

export function useAddressInput() {
  const { account } = useConnection();

  const [address, setAddress] = React.useState(account ? account : "");
  const prevAddress = React.useRef(address);

  const updateAddress = React.useCallback(
    (newAddress: string) => {
      prevAddress.current = address;
      setAddress(newAddress);
    },
    [address]
  );

  React.useEffect(() => {
    if (!account) return;

    if (!prevAddress.current) {
      setAddress(account);
    }
  }, [account]);
  const isValid = address ? isValidAddress(address) : true;

  return {
    address,
    isValid,
    updateAddress,
  };
}
