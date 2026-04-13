import { Container } from "pixi.js";

let centerX = 1000 / 2;
let centerY = 1000 / 2;

const ship = {
  x: 0,
  y: 0,
  m: 1,
  speed: 2,
};

export function moveWorld(
  delta: number,
  worldLayer: Container,
  keys: Set<string>,
  buildingsLayer: Container,
  workersLayer: Container,
) {
  let vx = 0;
  let vy = 0;

  if (keys.has("w") || keys.has("ц")) vy -= 1;
  if (keys.has("s") || keys.has("і")) vy += 1;
  if (keys.has("a") || keys.has("ф")) vx -= 1;
  if (keys.has("d") || keys.has("в")) vx += 1;
  if (keys.has("q") || keys.has("й")) ship.m += 0.001;
  if (keys.has("e") || keys.has("у")) ship.m -= 0.001;

  const length = Math.hypot(vx, vy);
  if (length > 0) {
    vx /= length;
    vy /= length;
  }

  ship.x += vx * ship.speed * delta;
  ship.y += vy * ship.speed * delta;

  worldLayer.x = centerX - ship.x;
  worldLayer.y = centerY - ship.y;

  worldLayer.scale.set(ship.m);
  buildingsLayer.scale.set(ship.m);
  workersLayer.scale.set(ship.m);

  centerX = (1000 / 2) * ship.m;
  centerY = (1000 / 2) * ship.m;

  return Math.atan2(vy, vx);
}
