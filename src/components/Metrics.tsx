import React from "react";
import tw, { styled } from "twin.macro";

import UnstyledHeading from "./Heading";
import { Info as InfoIcon } from "../assets/icons";

type TMetric = {
  value: string | number;
  quantifier?: string;
  description: string;
  extendedDescription?: string | React.ReactNode;
};
type MetricProps = {
  big?: boolean;
  metric: TMetric;
};
const Metric: React.FC<MetricProps> = ({ big = false, metric }) => {
  const { value, quantifier, description, extendedDescription } = metric;

  const Content = big ? (
    <>
      <div>
        <BigHeading level={1}>{value}</BigHeading>
        <div>{quantifier}</div>
      </div>
      <Description>UMA total value locked</Description>
    </>
  ) : (
    <>
      <Header>
        <Heading level={2}>{value}</Heading>
        <Quantifier>{quantifier}</Quantifier>
      </Header>
      <Description>
        {description} {extendedDescription && <InfoIcon />}
      </Description>
    </>
  );
  return <MetricWrapper>{Content}</MetricWrapper>;
};
const MetricWrapper = tw.div`
  first:row-span-2 py-5 border-b border-black border-opacity-50 flex flex-col justify-between
`;
const Description = styled.div`
  font-size: 22px;
  ${tw`flex items-center font-semibold`};
  > svg {
    ${tw`hover:cursor-pointer`}
    margin-left: 10px;
  }
`;
const Quantifier = styled.div`
  ${tw`font-semibold ml-2`};
  font-size: 22px;
`;
const Header = tw.div`flex items-baseline`;
const Heading = styled(UnstyledHeading)`
  font-size: 42px;
  ${tw`mb-5`};
`;
const BigHeading = styled(UnstyledHeading)`
  font-size: 100px;
  line-height: 1.08;
  ~ div {
    ${tw`font-semibold`};
    font-size: 42px;
    line-height: 1.375;
  }
`;

type MetricsProps = {
  metrics: TMetric[];
};

const Metrics: React.FC<MetricsProps> = ({ metrics }) => {
  return (
    <Wrapper>
      <Grid>
        {metrics.map((metric, idx) => (
          <Metric
            big={idx === 0}
            metric={metric}
            key={`${metric.value}-${idx}`}
          />
        ))}
      </Grid>
    </Wrapper>
  );
};
export default Metrics;

const Wrapper = tw.div`
 w-full mt-8 border-t border-black border-opacity-50
`;
const Grid = styled.div`
  ${tw`grid gap-x-5 pt-8`};
  grid-template-columns: 380px 1fr 1fr;
`;
