import { Container, Graphics } from "pixi.js";

export function createTestWorld(worldLayer: Container) {
  const testCircle = new Graphics()
    .circle(500, 100, 100)
    .stroke({ width: 4, color: "#000000" })
    .fill("#bababa");

  testCircle
    .circle(500, -100, 100)
    .stroke({ width: 4, color: "#000000" })
    .fill("#bababa");

  testCircle
    .circle(-500, -200, 100)
    .stroke({ width: 4, color: "#000000" })
    .fill("#bababa");

  testCircle
    .circle(1000, 100, 10)
    .stroke({ width: 4, color: "#000000" })
    .fill("#00ff00");

  worldLayer.addChild(testCircle);
}
