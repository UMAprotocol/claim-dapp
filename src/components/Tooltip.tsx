import React from "react";
import tw, { styled } from "twin.macro";

export type TooltipProps = {
  left?: number;
  top?: number;
  offsetLeft?: number;
  offsetTop?: number;
  position?: "left" | "right";
};
const Wrapper = styled.div<Omit<TooltipProps, "position">>`
  ${tw`pointer-events-none absolute rounded-sm shadow-md p-3 bg-white text-black text-sm max-w-xs`};
  width: fit-content;
  bottom: ${({ top, offsetTop }) =>
    top == null || offsetTop == null ? top : top + offsetTop}px;
  left: ${({ left, offsetLeft }) =>
    left == null || offsetLeft == null ? left : left + offsetLeft}px;
  strong {
    ${tw`font-semibold text-primary`}
  }
`;

const Arrow = styled.div<Pick<TooltipProps, "position">>`
  ${tw`pointer-events-none absolute min-w-0 min-h-0 border-t-8 border-white -bottom-2`};
  border-inline: 5px solid transparent;
  ${({ position }) => (position === "right" ? `right: 10px` : `left: 10px`)}
`;

const Tooltip: React.FC<TooltipProps> = ({
  children,
  position = "left",
  top = 0,
  left = 0,
  offsetLeft = 10,
  offsetTop = 10,
  ...delegated
}) => {
  return (
    <Wrapper top={top} left={left} {...delegated}>
      {children}
      <Arrow position={position} />
    </Wrapper>
  );
};
export default Tooltip;
