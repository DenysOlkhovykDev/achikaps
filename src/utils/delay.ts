export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRandomDelay(min: number, scale: number) {
  return min + Math.random() * scale;
}
