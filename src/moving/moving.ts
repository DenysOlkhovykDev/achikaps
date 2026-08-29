import { Container } from "pixi.js";
import { gameScreen } from "../game-config";

let centerX = gameScreen.width / 2;
let centerY = gameScreen.height / 2;

const ship = {
  x: 0,
  y: 0,
  m: 1,
  speed: 2,
};

export function moveWorld(
  delta: number,
  worldLayer: Container,
  buildingsLayer: Container,
  workersLayer: Container,
  vr: number,
  vy: number,
) {
  // if (keys.has("w") || keys.has("ц")) vy -= 1;
  // if (keys.has("s") || keys.has("і")) vy += 1;
  // if (keys.has("a") || keys.has("ф")) vx -= 1;
  // if (keys.has("d") || keys.has("в")) vx += 1;
  // if (keys.has("q") || keys.has("й")) ship.m += 0.001;
  // if (keys.has("e") || keys.has("у")) ship.m -= 0.001;

  let vx = 0;
  const length = Math.hypot(vx, vy);
  if (length > 0) {
    vx /= length;
    vy /= length;
  }

  const angle = -worldLayer.rotation;

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const worldVx = vx * cos - vy * sin;
  const worldVy = vx * sin + vy * cos;

  ship.x += worldVx * ship.speed * delta;
  ship.y += worldVy * ship.speed * delta;

  worldLayer.pivot.set(ship.x, ship.y);
  worldLayer.position.set(centerX, centerY);

  worldLayer.rotation -= vr / 200;

  worldLayer.scale.set(ship.m);
  buildingsLayer.scale.set(ship.m);
  workersLayer.scale.set(ship.m);

  centerX = (gameScreen.width / 2) * ship.m;
  centerY = (gameScreen.height / 2) * ship.m;

  if (vy === 0 && vx === 0) return undefined;
  return Math.atan2(vy, vx);
}
