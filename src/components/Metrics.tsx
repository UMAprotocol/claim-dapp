import React from "react";
import tw, { styled } from "twin.macro";

import UnstyledHeading from "./Heading";
import { Info as InfoIcon } from "../assets/icons";
import { useTooltip } from "../hooks";

type TMetric = {
  value: string | number;
  quantifier?: string;
  description: React.ReactNode;
  extendedDescription?: React.ReactNode;
};
type MetricProps = {
  big?: boolean;
  metric: TMetric;
};
const Metric: React.FC<MetricProps> = ({ big = false, metric }) => {
  const { value, quantifier, description, extendedDescription } = metric;
  const {
    tooltipOpen,
    tooltipTop,
    tooltipLeft,
    showTooltip,
    hideTooltip,
    TooltipComponent: Tooltip,
  } = useTooltip();

  const handleMouseOver = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const tooltipTop = window.innerHeight - rect.top + rect.height / 2;
    const tooltipLeft = rect.left - rect.width / 2;
    showTooltip({
      tooltipTop,
      tooltipLeft,
    });
  };
  const Content = big ? (
    <>
      <div>
        <BigHeading level={1}>{value}</BigHeading>
        <div>{quantifier}</div>
      </div>
      <Description>{description}</Description>
    </>
  ) : (
    <>
      <Header>
        <Heading level={2}>{value}</Heading>
        <Quantifier>{quantifier}</Quantifier>
      </Header>
      <Description>
        {description}{" "}
        {extendedDescription && (
          <InfoIcon onMouseOver={handleMouseOver} onMouseOut={hideTooltip} />
        )}
        {tooltipOpen && (
          <Tooltip top={tooltipTop} left={tooltipLeft}>
            {extendedDescription}
          </Tooltip>
        )}
      </Description>
    </>
  );
  return <MetricWrapper>{Content}</MetricWrapper>;
};
const MetricWrapper = tw.div`
  first:row-span-2 py-3 lg:py-5 border-b border-black border-opacity-50 flex flex-col justify-between
`;
const Description = styled.div`
  ${tw`flex items-center font-semibold text-xl`};
  > svg {
    ${tw`hover:cursor-pointer`}
    margin-left: 10px;
  }
`;
const Quantifier = styled.div`
  ${tw`font-semibold ml-2 text-xl`};
`;
const Header = tw.div`flex items-baseline`;
const Heading = styled(UnstyledHeading)`
  ${tw`mb-5 md:text-5xl text-3xl`};
`;
const BigHeading = styled(UnstyledHeading)`
  ${tw` md:text-8xl text-7xl`}
  ~ div {
    ${tw`font-semibold md:text-5xl text-3xl`};
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
  ${tw`grid grid-cols-1 md:grid-cols-2 gap-x-5 pt-8`};
  @media (min-width: 1280px) {
    grid-template-columns: 380px 1fr 1fr;
  }
`;
