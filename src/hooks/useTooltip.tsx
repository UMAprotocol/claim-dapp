import React from "react";

import { Portal, Tooltip } from "../components";
import { TooltipProps } from "../components/Tooltip";

type UseTooltip = {
  tooltipOpen: boolean;
  tooltipLeft?: number;
  tooltipTop?: number;
  showTooltip: (args: ShowTooltipArgs) => void;
  hideTooltip: () => void;
  TooltipComponent: React.FC<TooltipProps>;
};

type TooltipState = Pick<
  UseTooltip,
  "tooltipOpen" | "tooltipLeft" | "tooltipTop"
>;
type ShowTooltipArgs = Omit<TooltipState, "tooltipOpen">;

export function useTooltip(initialState?: Partial<TooltipState>): UseTooltip {
  const [tooltipState, setTooltipState] = React.useState({
    tooltipOpen: false,
    ...initialState,
  });

  const showTooltip = React.useCallback((showArgs: ShowTooltipArgs) => {
    setTooltipState({
      tooltipOpen: true,
      tooltipLeft: showArgs.tooltipLeft,
      tooltipTop: showArgs.tooltipTop,
    });
  }, []);

  const hideTooltip = React.useCallback(() => {
    setTooltipState({
      tooltipOpen: false,
      tooltipLeft: undefined,
      tooltipTop: undefined,
    });
  }, []);

  const TooltipComponent = React.useCallback(
    ({ top = 0, left = 0, ...tooltipProps }: TooltipProps) => {
      const portalLeft = left - window.scrollX;
      const portalTop = top - window.scrollY;
      return (
        <Portal>
          <Tooltip top={portalTop} left={portalLeft} {...tooltipProps} />
        </Portal>
      );
    },
    []
  );
  return {
    tooltipOpen: tooltipState.tooltipOpen,
    tooltipLeft: tooltipState.tooltipLeft,
    tooltipTop: tooltipState.tooltipTop,
    showTooltip,
    hideTooltip,
    TooltipComponent,
  };
}
