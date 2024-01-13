export function getScaleSize(width: number, height: number, max: number) {
  let _width: number, _height: number;
  if (height <= max && width <= max) {
    _width = width;
    _height = height;
  } else if (height > max && width > max) {
    if (height > width) {
      const scale = max / height;
      _height = max;
      _width = width * scale;
    } else {
      const scale = max / width;
      _width = max;
      _height = height * scale;
    }
  } else if (height > max) {
    const scale = max / height;
    _height = max;
    _width = width * scale;
  } else {
    const scale = max / width;
    _width = max;
    _height = height * scale;
  }
  return { height: _height, width: _width };
}
