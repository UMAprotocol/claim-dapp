import React from "react";
import tw, { styled } from "twin.macro";
import { getPageCoords } from "../utils";
import { useTooltip } from "../hooks";
import { Info as UnstyledIcon } from "../assets/icons";

export type InfoProps = {
  label: string;
  value: string | number;
  unit?: string;
  description?: React.ReactNode;
};

const Info: React.FC<InfoProps> = ({
  label,
  value,
  unit,
  description,
}: InfoProps) => {
  const {
    tooltipOpen,
    tooltipTop,
    tooltipLeft,
    TooltipComponent: Tooltip,
    showTooltip,
    hideTooltip,
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
        {label}{" "}
        {description && (
          <InfoIcon onMouseOver={handleMouseOver} onMouseLeave={hideTooltip} />
        )}
      </Label>
      <span>
        {value} <Unit>{unit}</Unit>
      </span>
      {tooltipOpen && (
        <Tooltip left={tooltipLeft} top={tooltipTop}>
          {description}
        </Tooltip>
      )}
    </Wrapper>
  );
};

type InfoListProps = {
  infos: InfoProps[];
};

const InfoList: React.FC<InfoListProps> = ({ infos }) => {
  return (
    <Grid>
      {infos.map((info) => (
        <Info {...info} key={info.label} />
      ))}
    </Grid>
  );
};
export default InfoList;

const Grid = tw.div`mt-5  grid grid-cols-3 grid-rows-2 gap-5`;
const Wrapper = tw.div`flex flex-col text-lg`;
const Label = tw.span`text-gray flex`;
const InfoIcon = styled(UnstyledIcon)`
  ${tw`relative top-1 hover:cursor-pointer`};
  margin-left: 10px;
`;
const Unit = tw.span`text-gray text-xs font-light ml-1`;
