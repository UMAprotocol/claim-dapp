export function getPageCoords(element: HTMLElement | SVGElement) {
  const { top, left } = element.getBoundingClientRect();
  return {
    top: window.innerHeight - top,
    left: left,
  };
}
