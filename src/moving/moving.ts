import { Container } from "pixi.js";

const VIEWPORT_SIZE = 1000;
const VIEWPORT_CENTER = VIEWPORT_SIZE / 2;
const MAX_FORWARD_SPEED = 3.4;
const MAX_REVERSE_SPEED = 1.9;
const MAX_TURN_SPEED = 0.014;

const ship = {
  x: 0,
  y: 0,
  velocityX: 0,
  velocityY: 0,
  angularVelocity: 0,
  visualOffsetX: 0,
  visualOffsetY: 0,
  visualBank: 0,
  scale: 1,
};

export type MotionState = {
  movementAngle?: number;
  speed: number;
  speedRatio: number;
  thrust: number;
  turn: number;
};

function approach(current: number, target: number, response: number) {
  return current + (target - current) * response;
}

export function moveWorld(
  delta: number,
  worldLayer: Container,
  distantWorldLayer: Container,
  buildingsLayer: Container,
  workersLayer: Container,
  turnInput: number,
  thrustInput: number,
): MotionState {
  // A large delta after returning to a background tab should not teleport the ship.
  const frameDelta = Math.min(Math.max(delta, 0), 3);
  const thrust = Math.max(-1, Math.min(1, thrustInput));
  const turn = Math.max(-1, Math.min(1, turnInput));

  const turnResponse = 1 - Math.exp(-0.12 * frameDelta);
  ship.angularVelocity = approach(
    ship.angularVelocity,
    turn * MAX_TURN_SPEED,
    turnResponse,
  );
  worldLayer.rotation -= ship.angularVelocity * frameDelta;

  const heading = -worldLayer.rotation;
  const forwardX = Math.sin(heading);
  const forwardY = -Math.cos(heading);
  const requestedSpeed =
    -thrust * (thrust < 0 ? MAX_FORWARD_SPEED : MAX_REVERSE_SPEED);

  const targetVelocityX = forwardX * requestedSpeed;
  const targetVelocityY = forwardY * requestedSpeed;
  const accelerationResponse = 1 - Math.exp(-0.075 * frameDelta);
  const coastingResponse = 1 - Math.exp(-0.025 * frameDelta);
  const velocityResponse = Math.abs(thrust) > 0.02
    ? accelerationResponse
    : coastingResponse;

  ship.velocityX = approach(
    ship.velocityX,
    targetVelocityX,
    velocityResponse,
  );
  ship.velocityY = approach(
    ship.velocityY,
    targetVelocityY,
    velocityResponse,
  );

  ship.x += ship.velocityX * frameDelta;
  ship.y += ship.velocityY * frameDelta;

  worldLayer.pivot.set(ship.x, ship.y);
  worldLayer.position.set(VIEWPORT_CENTER, VIEWPORT_CENTER);
  worldLayer.scale.set(ship.scale);

  // Distant specks move more slowly than islands, which adds a clear depth cue.
  distantWorldLayer.pivot.set(ship.x * 0.28, ship.y * 0.28);
  distantWorldLayer.position.set(VIEWPORT_CENTER, VIEWPORT_CENTER);
  distantWorldLayer.rotation = worldLayer.rotation * 0.22;
  distantWorldLayer.scale.set(ship.scale);

  const cos = Math.cos(worldLayer.rotation);
  const sin = Math.sin(worldLayer.rotation);
  const screenVelocityX = ship.velocityX * cos - ship.velocityY * sin;
  const screenVelocityY = ship.velocityX * sin + ship.velocityY * cos;
  const visualResponse = 1 - Math.exp(-0.1 * frameDelta);

  // The colony is the player's ship. A little camera lag and banking makes it
  // feel like a moving body instead of a UI pinned over a scrolling backdrop.
  ship.visualOffsetX = approach(
    ship.visualOffsetX,
    screenVelocityX * 4.2,
    visualResponse,
  );
  ship.visualOffsetY = approach(
    ship.visualOffsetY,
    screenVelocityY * 4.2,
    visualResponse,
  );
  ship.visualBank = approach(
    ship.visualBank,
    turn * 0.018,
    visualResponse,
  );

  for (const layer of [buildingsLayer, workersLayer]) {
    layer.pivot.set(VIEWPORT_CENTER, VIEWPORT_CENTER);
    layer.position.set(
      VIEWPORT_CENTER + ship.visualOffsetX,
      VIEWPORT_CENTER + ship.visualOffsetY,
    );
    layer.rotation = ship.visualBank;
    layer.scale.set(ship.scale);
  }

  const speed = Math.hypot(ship.velocityX, ship.velocityY);
  const movementAngle =
    speed > 0.06
      ? Math.atan2(screenVelocityY, screenVelocityX)
      : undefined;

  return {
    movementAngle,
    speed,
    speedRatio: Math.min(speed / MAX_FORWARD_SPEED, 1),
    thrust,
    turn,
  };
}
