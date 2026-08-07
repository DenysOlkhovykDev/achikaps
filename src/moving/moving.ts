import { Container } from "pixi.js";

let centerX = 1000 / 2;
let centerY = 1000 / 2;

const ship = {
  x: 0,
  y: 0,
  scale: 1,
  speed: 2,
};

export function moveWorld(
  delta: number,
  worldLayer: Container,
  buildingsLayer: Container,
  workersLayer: Container,
  turnInput: number,
  thrustInput: number,
) {
  const thrust = Math.max(-1, Math.min(1, thrustInput));
  const angle = -worldLayer.rotation;

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const worldVx = -thrust * sin;
  const worldVy = thrust * cos;

  ship.x += worldVx * ship.speed * delta;
  ship.y += worldVy * ship.speed * delta;

  worldLayer.pivot.set(ship.x, ship.y);
  worldLayer.position.set(centerX, centerY);
  worldLayer.rotation -= (turnInput / 200) * delta;

  worldLayer.scale.set(ship.scale);
  buildingsLayer.scale.set(ship.scale);
  workersLayer.scale.set(ship.scale);

  centerX = (1000 / 2) * ship.scale;
  centerY = (1000 / 2) * ship.scale;

  if (thrust === 0) return undefined;
  return Math.atan2(thrust, 0);
}
