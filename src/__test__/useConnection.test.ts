import { renderHook, act } from "@testing-library/react-hooks";

import { ethers } from "ethers";

import { useConnection, ConnectionProvider } from "../hooks/useConnection";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
const jsonRpcFunc = (method: string, params?: Array<any>) =>
  provider.send(method, params || []);
const web3Provider = new ethers.providers.Web3Provider(jsonRpcFunc);
const wallet = ethers.Wallet.createRandom();
const randomAddress = ethers.Wallet.createRandom().address;

const fakeProvider = { provider: web3Provider, signer: wallet };

test("should connect to the provider and save the data", async () => {
  const { result } = renderHook(useConnection, { wrapper: ConnectionProvider });

  expect(result.current.provider).toBeUndefined();
  expect(result.current.signer).toBeUndefined();
  expect(result.current.chainId).toBeUndefined();
  expect(result.current.account).toBeUndefined();
  expect(result.current.error).toBeUndefined();
  expect(result.current.isConnected).toBe(false);

  await act(async () =>
    result.current.connect({
      provider: fakeProvider.provider,
      chainId: (await fakeProvider.provider.getNetwork()).chainId,
      account: await fakeProvider.signer.getAddress(),
    })
  );

  expect(result.current.provider).toStrictEqual(web3Provider);
  expect(result.current.signer).toStrictEqual(wallet);
  expect(result.current.chainId).toBe(1337);
  expect(result.current.isConnected).toBe(true);

  act(() => {
    result.current.update({ chainId: 1 });
  });
  expect(result.current.chainId).toBe(1);

  act(() => {
    result.current.update({ account: randomAddress });
  });
  expect(result.current.account).toBe(randomAddress);
});
