import { Graphics } from "pixi.js";

export const circles: Graphics[] = [];

export function addCircle(x: number, y: number) {
  const circle = new Graphics()
    .circle(x, y, 20)
    .stroke({
      width: 2,
      color: "#000000",
    })
    .fill("#acacac");

  circles.push(circle);
}
