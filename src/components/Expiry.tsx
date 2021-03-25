import React from "react";
import tw, { styled } from "twin.macro";

import { Info as UnstyledInfo } from "../assets/icons";
import { useCountdown, Time, useTooltip } from "../hooks";
import { getPageCoords } from "../utils";
import Heading from "./Heading";

const DateCounter: React.FC<{ date: Time }> = ({ date }) => {
  const { days, hours, minutes, seconds } = useCountdown(date);

  return (
    <DateCounterWrapper>
      <DateCounterGrid>
        <DateCounterItem>{days}</DateCounterItem>
        <DateCounterItem>{hours}</DateCounterItem>
        <DateCounterItem>{minutes}</DateCounterItem>
        <DateCounterItem>{seconds}</DateCounterItem>
      </DateCounterGrid>
      <DateCounterLabels>
        <div>days</div>
        <div>hours</div>
        <div>min.</div>
        <div>sec.</div>
      </DateCounterLabels>
    </DateCounterWrapper>
  );
};

const DateCounterItem = styled.div`
  ${tw`px-3 py-1 bg-gray-dark first:rounded-tl first:rounded-bl last:rounded-tr last:rounded-br`};
  font-size: 22px;
`;
const DateCounterGrid = tw.div`
      grid grid-cols-4 divide-x 
  `;
const DateCounterLabels = tw.div`grid grid-cols-4 capitalize`;
const DateCounterWrapper = styled.div`
  ${tw`grid grid-rows-2 text-center`};
  grid-row-gap: 10px;
`;

type ExpiryProps = {
  expiryDate: Time;
  description?: React.ReactNode;
};

const Expiry: React.FC<ExpiryProps> = ({ expiryDate, description }) => {
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    showTooltip,
    hideTooltip,
    TooltipComponent: Tooltip,
  } = useTooltip();

  const handleMouseOver = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    const { top, left } = getPageCoords(event.currentTarget);
    const rect = event.currentTarget.getBoundingClientRect();
    showTooltip({
      tooltipTop: top + rect.height / 2,
      tooltipLeft: left - rect.width / 2,
    });
  };
  return (
    <Wrapper>
      <ExpiryHeading level={6}>
        Options expire in:{" "}
        <InfoIcon onMouseOver={handleMouseOver} onMouseLeave={hideTooltip} />
      </ExpiryHeading>
      <DateCounter date={expiryDate} />
      {tooltipOpen && (
        <Tooltip top={tooltipTop} left={tooltipLeft}>
          {description}
        </Tooltip>
      )}
    </Wrapper>
  );
};

const InfoIcon = styled(UnstyledInfo)`
  ${tw`relative top-1 hover:cursor-pointer`};
  margin-left: 10px;
`;
const Wrapper = tw.div`
    flex flex-col bg-gray-darkest p-5
`;
const ExpiryHeading = styled(Heading)`
  ${tw`flex text-lg`};
  margin-bottom: 10px;
`;
export default Expiry;
