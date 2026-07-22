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
