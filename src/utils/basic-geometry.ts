export function getDistance(x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function rotatePoint(px: number, py: number, cos: number, sin: number) {
  return {
    x: px * cos - py * sin,
    y: px * sin + py * cos,
  };
}

export function getRandomCoordinate(size: number, modifier: number) {
  return -size + modifier + Math.random() * (size - modifier);
}

export function getRadialPoint(index: number, count: number, radius: number) {
  const angle = (Math.PI * 2 * index) / count;

  return {
    angle,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

export function getRadialLine(
  index: number,
  count: number,
  startRadius: number,
  endRadius: number,
) {
  const angle = (Math.PI * 2 * index) / count;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    angle,
    startX: cos * startRadius,
    startY: sin * startRadius,
    endX: cos * endRadius,
    endY: sin * endRadius,
  };
}
