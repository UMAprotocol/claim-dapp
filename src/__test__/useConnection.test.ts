import { renderHook, act } from "@testing-library/react-hooks";
import Onboard from "bnc-onboard";
import * as ethers from "ethers";
import {
  API as OnboardApi,
  Initialization,
} from "bnc-onboard/dist/src/interfaces";

import { useConnection, ConnectionProvider } from "../hooks";

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

jest.mock("bnc-onboard");
const mockedOnboard = Onboard as jest.Mock<Partial<OnboardApi>>;
const mockedWalletSelect = jest.fn();
const mockedWalletCheck = jest.fn();

const mockProviderFn: ethers.providers.JsonRpcFetchFunc = jest.fn();

jest
  .spyOn(ethers.providers.Web3Provider.prototype, "getNetwork")
  .mockImplementation(async () => {
    return {
      chainId: 1,
      name: "mainnet",
    };
  });
let fakeProvider: ethers.providers.Web3Provider;
let fakeNetwork: ethers.providers.Network;
let fakeAddress: string;

beforeAll(async () => {
  fakeProvider = new ethers.providers.Web3Provider(mockProviderFn);
  fakeNetwork = await fakeProvider.getNetwork();
});

test("should connect to the provider and save the data", async () => {
  const { promise, resolve } = deferred();

  mockedOnboard.mockImplementation(({ subscriptions }: Initialization) => {
    promise.then(() => {
      subscriptions?.address && subscriptions.address(fakeAddress);
      subscriptions?.network && subscriptions.network(fakeNetwork.chainId);
      subscriptions?.wallet &&
        subscriptions.wallet({
          provider: mockProviderFn,
          type: "injected",
          name: "fake wallet",
        });
    });
    return {
      walletCheck: mockedWalletCheck,
      walletSelect: mockedWalletSelect,
    };
  });
  const { result } = renderHook(useConnection, { wrapper: ConnectionProvider });

  expect(result.current.provider).toBeNull();
  expect(result.current.signer).toBeNull();
  expect(result.current.network).toBeNull();
  expect(result.current.address).toBeNull();
  expect(result.current.error).toBeNull();

  await act(async () => await result.current.connect());
  expect(mockedOnboard).toHaveBeenCalledTimes(1);
  expect(mockedWalletSelect).toHaveBeenCalledTimes(1);
  expect(mockedWalletCheck).toHaveBeenCalledTimes(1);

  await act(async () => {
    (resolve as any)();
    await promise;
  });

  expect(result.current.provider).toStrictEqual(fakeProvider);
  expect(result.current.signer).toStrictEqual(fakeProvider.getSigner());
  expect(result.current.provider?.getNetwork).toHaveBeenCalledTimes(1);
  expect(result.current.address).toBe(fakeAddress);
  expect(result.current.error).toBeNull();
});
