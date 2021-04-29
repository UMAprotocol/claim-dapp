import { renderHook, act } from "@testing-library/react-hooks";

import { ethers } from "ethers";

import EventEmitter from "events";

import { useConnection, ConnectionProvider } from "../hooks/useConnection";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const jsonRpcFunc = (method: string, params?: Array<any>) =>
  provider.send(method, params || []);
const web3Provider = new ethers.providers.Web3Provider(jsonRpcFunc);
const wallet = ethers.Wallet.createRandom();
const randomAddress = ethers.Wallet.createRandom().address;

class Connector extends EventEmitter {
  provider: ethers.providers.Web3Provider;
  signer: ethers.Signer;
  constructor(provider: ethers.providers.Web3Provider, signer: ethers.Signer) {
    super();
    this.provider = provider;
    this.signer = signer;
  }
  emitUpdate(update: any) {
    this.emit("update", update);
  }
  emitChainChanged(chainId: number) {
    this.emit("chain_changed", chainId);
  }
  emitAccountChanged(account: string) {
    this.emit("account_changed", account);
  }
}
const fakeProvider = new Connector(web3Provider, wallet);

test("should connect to the provider and save the data", async () => {
  const { result } = renderHook(useConnection, { wrapper: ConnectionProvider });

  expect(result.current.provider).toBeUndefined();
  expect(result.current.signer).toBeUndefined();
  expect(result.current.chainId).toBeUndefined();
  expect(result.current.account).toBeUndefined();
  expect(result.current.error).toBeUndefined();
  expect(result.current.isConnected).toBe(false);

  // set up event listeners for our fake provider events
  fakeProvider.on("chain_changed", (chainId: number) => {
    result.current.update({ chainId });
  });
  fakeProvider.on("account_changed", (account) => {
    result.current.update({ account });
  });
  fakeProvider.on("update", (update) => {
    result.current.update({ ...update });
  });
  await act(async () =>
    result.current.connect({
      provider: fakeProvider.provider,
      signer: fakeProvider.signer,
      chainId: (await fakeProvider.provider.getNetwork()).chainId,
      account: await fakeProvider.signer.getAddress(),
    })
  );

  expect(result.current.provider).toStrictEqual(web3Provider);
  expect(result.current.signer).toStrictEqual(wallet);
  expect(result.current.chainId).toBe(1337);
  expect(result.current.isConnected).toBe(true);

  act(() => {
    fakeProvider.emit("chain_changed", 1);
  });
  expect(result.current.chainId).toBe(1);

  act(() => {
    fakeProvider.emit("account_changed", randomAddress);
  });
  expect(result.current.account).toBe(randomAddress);
});
