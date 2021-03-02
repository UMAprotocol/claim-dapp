import React from "react";
import tw, { styled } from "twin.macro";
import { useProgress } from "../hooks";
import { Info } from "../assets/icons";

type ProgressBarProps = {
  max: number;
  current: number;
  width?: number;
  height?: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  max,
  current,
  width = 380,
  height = 10,
}) => {
  const { totalWidth, filledWidth } = useProgress({
    max,
    current,
    width,
  });
  return (
    <Wrapper>
      <Label>
        <span>Lvl.</span> {current} of {max}
        <Info />
      </Label>
      <Bar width={totalWidth} height={height}>
        <Progress width={filledWidth} height={height} />
      </Bar>
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
