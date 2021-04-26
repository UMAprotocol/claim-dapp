import React from "react";
import tw, { styled } from "twin.macro";

import { useConnection, usePayouts, useTvl, useHasClaimed } from "../hooks";

import Heading from "./Heading";
import Button from "./Button";
import ProgressBar from "./ProgressBar";
import Expiry from "./Expiry";
import InfoList, { InfoProps } from "./InfoList";
import Reason from "./Reason";
import { expiryDate, optionsName } from "../config";

const defaultInfos: Record<string, InfoProps> = {
  quantity: {
    label: "Quantity",
    value: "-",
    unit: `${optionsName}`,
  },
  expiry: {
    label: "Expiry",
    value: expiryDate.replace(/UTC/g, ""),
    description: (
      <span>
        The <strong>UTC</strong> time at which your options will{" "}
        <strong>expire</strong>.
      </span>
    ),
  },
  minPayout: {
    label: "Min. Payout",
    value: "-",
    unit: "UMA",
    description: (
      <span>
        The <strong>minimum</strong> amount of UMA all of your {optionsName}{" "}
        options will be worth <strong>based on UMA’s current TVL</strong>.
      </span>
    ),
  },
  currentPayout: {
    label: "Current Payout",
    value: "-",
    unit: "UMA",
    description: (
      <span>
        The <strong>current</strong> amount of UMA all of your {optionsName}{" "}
        options are worth <strong>based on UMA’s current TVL</strong>.
      </span>
    ),
  },
  maxPayout: {
    label: "Max. Payout",
    value: "-",
    unit: "UMA",
    description: (
      <span>
        The <strong>maximum</strong> amount of UMA all of your {optionsName}{" "}
        options can be worth if UMA’s TVL reaches <strong>$2 billion</strong>.
      </span>
    ),
  },
};

type KPIOptionsProps = {
  onClaim: () => void;
};
const KPIOptions: React.FC<KPIOptionsProps> = ({ onClaim }) => {
  const { isConnected } = useConnection();

  const { data: tvlData } = useTvl();

  const { metaData, ...values } = usePayouts();

  const infos = React.useMemo(() => updateInfos({ ...values }), [values]);
  const hasClaimed = useHasClaimed();
  const disableClaim = hasClaimed && isConnected;
  const handleClick = React.useCallback(() => {
    onClaim();
  }, [onClaim]);
  const tvl = tvlData?.currentTvl;

  return (
    <Wrapper>
      <MainHeading level={3}>Your KPI Options</MainHeading>
      <Content>
        <ContentHeader>
          <OptionName>uTVL-0621</OptionName>
          <ClaimButton
            onClick={handleClick}
            disabled={!isConnected || disableClaim}
          >
            Claim Options
          </ClaimButton>
        </ContentHeader>
        <ContentMain>
          <ProgressBar
            max={2000}
            current={Number(tvl ?? 0) / 10 ** 6}
            description={
              <p>
                Track <strong>UMA’s progress</strong> towards reaching{" "}
                <strong>$2 billion!</strong> If UMA’s TVL reaches $2 billion,{" "}
                <strong>{optionsName}</strong> token holders receive the{" "}
                <strong>max</strong> payout at expiry!
              </p>
            }
          />
          <InfoList infos={Object.values(infos)} />
          <Reason reasons={metaData} />
        </ContentMain>
        <Expiry
          expiryDate={expiryDate}
          description={
            <p>
              Redeem <strong>{optionsName}</strong> tokens for{" "}
              <strong>UMA</strong> tokens at expiry
            </p>
          }
        />
      </Content>
    </Wrapper>
  );
};
export default KPIOptions;
const Wrapper = tw.div`w-full`;
const MainHeading = styled(Heading)`
  font-size: 2rem;
  ${tw`text-center mb-5`}
`;
const OptionName = styled.div`
  font-size: 28px;
`;
const ClaimButton = styled(Button)`
  ${tw`py-4 px-6 sm:px-12 disabled:opacity-75 disabled:cursor-not-allowed`}
`;
const Content = tw.div`
    border-b border-t border-gray 
 `;
const ContentHeader = tw.div`
    flex justify-between items-center bg-gray-darkest p-5
`;
const ContentMain = tw.div`p-5`;

function updateInfos(values: { [key: string]: unknown } | undefined) {
  return values
    ? Object.keys(defaultInfos).reduce((obj, key) => {
        const value = values[key] || defaultInfos[key].value;
        return { ...obj, [key]: { ...defaultInfos[key], value } };
      }, {})
    : defaultInfos;
}
