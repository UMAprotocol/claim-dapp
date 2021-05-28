# claim-dapp

To start the app run `yarn start` after `yarn install`.

## Enviroment Variables

The app needs the following environment variables to function correctly:

- `REACT_APP_PUBLIC_MAINNET_DISTRIBUTOR_ADDRESS`
- `REACT_APP_PUBLIC_KOVAN_DISTRIBUTOR_ADDRESS`
- `REACT_APP_PUBLIC_WINDOW_INDEX`
- `REACT_APP_PUBLIC_TVL_ENDPOINT`
- `REACT_APP_PUBLIC_MERKLE_PROOF_HELPER`
- `REACT_APP_PUBLIC_MAINNET_DISTRIBUTOR_ADDRESS`
- `REACT_APP_PUBLIC_KOVAN_DISTRIBUTOR_ADDRESS`
- `REACT_APP_PUBLIC_LOCAL_DISTRIBUTOR_ADDRESS`
- `REACT_APP_PUBLIC_WINDOW_INDEX`
- `REACT_APP_PUBLIC_TVL_ENDPOINT`
- `REACT_APP_PUBLIC_MERKLE_PROOF_HELPER`
- `REACT_APP_PUBLIC_MAINNET_KPI_TOKEN_ADDRESS`
- `REACT_APP_PUBLIC_KOVAN_KPI_TOKEN_ADDRESS`
- `REACT_APP_PUBLIC_LOCAL_KPI_TOKEN_ADDRESS`
- `REACT_APP_PUBLIC_MAINNET_KPI_EMP`
- `REACT_APP_PUBLIC_LOCAL_KPI_EMP`
- `REACT_APP_PUBLIC_INFURA_ID`
- `REACT_APP_PUBLIC_ONBOARD_API_KEY`
- `REACT_APP_PUBLIC_PORTIS_API_KEY`
- `REACT_APP_PUBLIC_HAS_EXPIRED`
- `REACT_APP_PUBLIC_FINAL_TVL`

## Running locally against an expired EMP.

To run the app locally against an expired EMP, follow this steps:

### Start a local node

Run `yarn start-node` to run a local hardhat node.

### Deploy an EMP and bring it to expiry.

Run `yarn deploy-emp` to run an hardhat task that deploys an EMP and brings it to expiry. You will need to save the test synth address and the test emp address and use them as values for `REACT_APP_PUBLIC_LOCAL_KPI_TOKEN_ADDRESS` and `REACT_APP_PUBLIC_LOCAL_KPI_EMP`. Also set `REACT_APP_PUBLIC_HAS_EXPIRED` to `1`

### Set up MetaMask and try the app.

Run `yarn start` to start the app on `localhost:3000`, after doing so, you'll want to import hardhat default seed phrase into Metamask as that will allow you to access the accounts that have your fake KPI options from the previous step. You can find the mnemonic in `hardhat.config.ts`.
If you encounter transaction failures, you should reset your metamask account, as sometimes metamask goes out of sync with the local hardhat chain.
