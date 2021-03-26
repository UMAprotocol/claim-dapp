import React from "react";
import tw, { styled } from "twin.macro";
import { useProgress, useTooltip } from "../hooks";
import { formatUSLocaleNumber, getPageCoords } from "../utils";
import { Info as Icon } from "../assets/icons";

type ProgressBarProps = {
  max: number;
  current: number;
  width?: number;
  height?: number;
  description?: React.ReactNode;
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

  const descriptionRef = React.useRef<React.ReactNode>();

  const progressDescription = (
    <p>
      <strong>{formatMillions(current)}</strong> out of{" "}
      <strong>{formatMillions(max)}</strong>
    </p>
  );

  const handleMouseOver = (
    event: React.MouseEvent<HTMLElement | SVGElement, MouseEvent>,
    isBar: boolean
  ) => {
    // set the description based on which element was clicked
    descriptionRef.current = isBar ? progressDescription : description;
    const { top, left, right, width } = getPageCoords(event.currentTarget);
    // The -16 and plus +10 below are to take into account the tooltip arrow dimensions
    const finalTop = top + 10;
    const finalLeft = isBar ? right - 16 : left - width / 2;
    showTooltip({
      tooltipTop: finalTop,
      tooltipLeft: finalLeft,
    });
  };
  return (
    <Wrapper>
      <Label>
        <span> UMA’s TVL </span>
        <Icon
          onMouseOver={(e) => handleMouseOver(e, false)}
          onMouseLeave={hideTooltip}
        />
      </Label>
      <Bar width={totalWidth} height={height}>
        <Progress
          width={Math.round(filledWidth)}
          height={height}
          onMouseOver={(e) => handleMouseOver(e, true)}
          onMouseLeave={hideTooltip}
        />
      </Bar>
      {tooltipOpen && (
        <Tooltip top={tooltipTop} left={tooltipLeft}>
          {descriptionRef.current}
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
  ${tw`flex mr-5 text-gray`};
  > span {
    ${tw`mr-1`}
  }
  > svg {
    ${tw`hover:cursor-pointer`}
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

function formatMillions(n: number) {
  let formattedN;
  let postfix;
  // Dealing with Billions
  if (n >= 1000) {
    formattedN = n / 1000;
    postfix = "Billions";
  } else {
    formattedN = n;
    postfix = "Million";
  }
  return `${formatUSLocaleNumber(formattedN, 0, "USD")} ${postfix}`;
}
