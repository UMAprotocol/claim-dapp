import { ethers } from "ethers";

export const ethereumAddressRegex = "^0x[a-fA-F0-9]{40}$";
export const ensRegex = "[a-z]+.eth$";

export function isValidAddress(address: string): boolean {
  if (typeof address !== "string") {
    return false;
  }
  return address.match(ensRegex)
    ? ethers.utils.isValidName(address)
    : ethers.utils.isAddress(address);
}
