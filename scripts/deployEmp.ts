import type HardhatRuntimeEnvironment from "hardhat";

import { EthersContracts } from "@uma/core";

//@ts-expect-error
import { interfaceName } from "@uma/common";

const {
  ExpandedERC20__factory,
  Timer__factory,
  Finder__factory,
  IdentifierWhitelist__factory,
  AddressWhitelist__factory,
  MockOracle__factory,
  OptimisticOracle__factory,
  Store__factory,
  ExpiringMultiParty__factory,
  SyntheticToken__factory,
} = EthersContracts;

// Constants definitions

const fiveMinutesFromNow = () => new Date().getTime() + 1000 * 60 * 5;

export async function deployEmp(hre: typeof HardhatRuntimeEnvironment) {
  const { ethers } = hre;
  const priceFeedIdentifier = ethers.utils.formatBytes32String("uTVL_KPI_UMA");
  const [deployer, receiver] = await ethers.getSigners();
  const finder = await new Finder__factory(deployer).deploy();

  const identifierWhitelist = await new IdentifierWhitelist__factory(
    deployer
  ).deploy();

  finder.changeImplementationAddress(
    ethers.utils.formatBytes32String(interfaceName.IdentifierWhitelist),
    identifierWhitelist.address
  );

  const timer = await new Timer__factory(deployer).deploy();
  const mockOracle = await new MockOracle__factory(deployer).deploy(
    finder.address,
    timer.address
  );
  // register the mock oracle to the Finder.
  await finder.changeImplementationAddress(
    ethers.utils.formatBytes32String(interfaceName.Oracle),
    mockOracle.address
  );

  const store = await new Store__factory(deployer).deploy(
    { rawValue: 0 },
    { rawValue: 0 },
    timer.address
  );
  await finder.changeImplementationAddress(
    ethers.utils.formatBytes32String(interfaceName.Store),
    store.address
  );

  const syntheticToken = await new SyntheticToken__factory(deployer).deploy(
    "uTVL Test",
    "uTVL",
    18
  );

  console.log(
    `✅ Deployed synthetic ${await syntheticToken.symbol()} at ${
      syntheticToken.address
    }`
  );
  const collateralToken = await new ExpandedERC20__factory(deployer).deploy(
    "Test Collateral",
    "TEST",
    18
  );

  console.log(
    `✅ Deployed collateral ${await collateralToken.symbol()} at ${
      collateralToken.address
    }`
  );
  await collateralToken.addMember(1, deployer.address);
  const collateralWhitelist = await new AddressWhitelist__factory(
    deployer
  ).deploy();

  await finder.changeImplementationAddress(
    ethers.utils.formatBytes32String(interfaceName.CollateralWhitelist),
    collateralWhitelist.address
  );

  // whitelist collateral currency
  await collateralWhitelist.addToWhitelist(collateralToken.address);
  console.log(`✅  ${await collateralToken.symbol()} added to whitelist.`);

  //  add our price identifier to the whitelist.

  await identifierWhitelist.addSupportedIdentifier(priceFeedIdentifier);
  console.log(`✅ Whitelisted new price identifier: ${priceFeedIdentifier}`);

  const optimisticOracle = await new OptimisticOracle__factory(deployer).deploy(
    60,
    finder.address,
    timer.address
  );

  await finder.changeImplementationAddress(
    ethers.utils.formatBytes32String("OptimisticOracle"),
    optimisticOracle.address
  );
  // finally deploy the emp
  const expirationTimestamp = fiveMinutesFromNow();

  const empParams = {
    expirationTimestamp,
    collateralAddress: collateralToken.address,
    tokenAddress: syntheticToken.address,
    finderAddress: finder.address,
    timerAddress: timer.address,
    collateralRequirement: { rawValue: ethers.utils.parseEther("1.5") },
    disputeBondPercentage: { rawValue: ethers.utils.parseEther("0.1") },
    sponsorDisputeRewardPercentage: {
      rawValue: ethers.utils.parseEther("0.05"),
    },
    disputerDisputeRewardPercentage: {
      rawValue: ethers.utils.parseEther("0.2"),
    },
    priceFeedIdentifier,
    minSponsorTokens: { rawValue: ethers.utils.parseEther("1") },
    withdrawalLiveness: 7200,
    liquidationLiveness: 7200,
    financialProductLibraryAddress: ethers.constants.AddressZero,
  };

  const emp = await new ExpiringMultiParty__factory(deployer).deploy(empParams);
  await syntheticToken.addBurner(emp.address);
  await syntheticToken.addMinter(emp.address);

  console.log(`✅ Created a new EMP, at ${emp.address}`);

  // mint some tokens

  const approveInfiniteAmount = ethers.utils.parseEther(
    "10000000000000000000000"
  );
  await collateralToken.mint(
    deployer.address,
    ethers.utils.parseEther("100000000")
  );
  await collateralToken.approve(emp.address, approveInfiniteAmount);

  await emp.create(
    { rawValue: ethers.utils.parseEther("150") },
    { rawValue: ethers.utils.parseEther("100") }
  );

  await syntheticToken.transfer(
    receiver.address,
    ethers.utils.parseEther("50")
  );

  console.log(
    `Current synth balance ${await syntheticToken.balanceOf(receiver.address)}`
  );

  await timer.setCurrentTime(expirationTimestamp);

  // make the emp expire
  await emp.expire();

  await optimisticOracle.proposePrice(
    emp.address,
    priceFeedIdentifier,
    expirationTimestamp,
    syntheticToken.address,
    ethers.utils.parseEther("1")
  );

  await timer.setCurrentTime(expirationTimestamp + 12000);

  console.log(
    `Current receiver collateral balance ${await (
      await collateralToken.balanceOf(receiver.address)
    ).toString()}`
  );

  const empFromRecevier = emp.connect(receiver);
  const syntheticTokenFromReceiver = syntheticToken.connect(receiver);

  await syntheticTokenFromReceiver.approve(
    empFromRecevier.address,
    approveInfiniteAmount
  );

  await empFromRecevier.settleExpired();

  console.log(
    `New receiver collateral balance ${await (
      await collateralToken.balanceOf(receiver.address)
    ).toString()}`
  );

  console.log(`
    To test the app locally, you might want to add those env variables:
    REACT_APP_PUBLIC_LOCAL_KPI_TOKEN_ADDRESS=${syntheticToken.address}
    REACT_APP_PUBLIC_LOCAL_UMA_ADDRESS=${collateralToken.address}
    REACT_APP_PUBLIC_LOCAL_KPI_EMP=${emp.address}
    REACT_APP_PUBLIC_HAS_EXPIRED=1
`);
}
