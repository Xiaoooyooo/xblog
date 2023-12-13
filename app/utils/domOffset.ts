/**
 * Calculate the offset of element relative to body
 */
export default function domOffset(element: HTMLElement) {
  let left = 0,
    top = 0,
    target = element;
  while (target !== document.body) {
    left += target.offsetLeft;
    top += target.offsetTop;
    const parent = target.offsetParent as HTMLElement;
    if (parent === null) {
      break;
    }
    target = parent;
  }
  if (target !== document.body) {
    // fix positioned element
    top += window.scrollY;
    left += window.scrollX;
  }
  return { left, top };
}
