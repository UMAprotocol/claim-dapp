import { renderHook, act } from "@testing-library/react-hooks";

import { network, ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import { useConnection, ConnectionProvider } from "../hooks/useConnection";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const provider = network.provider;
const jsonRpcFunc = (method: string, params?: Array<any>) =>
  provider.send(method, params || []);
const web3Provider = new ethers.providers.Web3Provider(jsonRpcFunc);

let fakeSigner: SignerWithAddress;
let randomAddress: string;
beforeAll(async () => {
  const [account, secondAccount] = await ethers.getSigners();
  fakeSigner = account;
  randomAddress = secondAccount.address;
});

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
      provider: web3Provider,
      chainId: (await web3Provider.getNetwork()).chainId,
      account: await fakeSigner.getAddress(),
    })
  );

  expect(result.current.account).toStrictEqual(fakeSigner.address);
  expect(result.current.chainId).toBe(
    (await web3Provider.getNetwork()).chainId
  );
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
