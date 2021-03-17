import React from "react";
import tw, { styled } from "twin.macro";
import { useProgress, useTooltip } from "../hooks";
import { getPageCoords } from "../utils";
import { Info as Icon } from "../assets/icons";

type ProgressBarProps = {
  max: number;
  current: number;
  width?: number;
  height?: number;
  description?: string;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  max,
  current,
  width = 380,
  height = 10,
  description,
}) => {
  const { totalWidth, filledWidth } = useProgress({
    max,
    current,
    width,
  });
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
      <Label>
        <span>TVL.</span> {current} of {max}
        {description && (
          <Info onMouseOver={handleMouseOver} onMouseLeave={hideTooltip} />
        )}
      </Label>
      <Bar width={totalWidth} height={height}>
        <Progress width={filledWidth} height={height} />
      </Bar>
      {tooltipOpen && (
        <Tooltip top={tooltipTop} left={tooltipLeft}>
          {description}
        </Tooltip>
      )}
    </Wrapper>
  );
};

export default ProgressBar;

const Wrapper = tw.div`
    flex items-center
`;
const Label = styled.div`
  ${tw`flex mr-5`};
  > span {
    ${tw`text-gray mr-1`}
  }
  > svg {
    margin-left: 10px;
  }
`;
const Bar = styled.div<{ width: number; height: number }>`
  ${tw`relative bg-gray-darker`};
  min-height: ${(props) => props.height}px;
  max-height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
`;
const Progress = tw(Bar)`
    absolute bg-secondary
`;
const Info = tw(Icon)`
  hover:cursor-pointer
`;
