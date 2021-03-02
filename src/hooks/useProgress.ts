type useProgressParams<T = number> = {
  width?: number;
  current: T;
  max: T;
  compareFn?: (current: T, max: T) => number;
};
export function useProgress({
  width: totalWidth = 100,
  current,
  max,
  compareFn,
}: useProgressParams) {
  const progress = compareFn
    ? compareFn(current, max)
    : Math.floor((current / max) * 100) / 100;
  const filledWidth = totalWidth * progress;

  return {
    progress,
    filledWidth,
    totalWidth,
  };
}
