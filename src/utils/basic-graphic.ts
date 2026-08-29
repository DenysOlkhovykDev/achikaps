import { Graphics, Container, Rectangle } from "pixi.js";
import { app } from "../main";

export function generateTextureFromOrigin(target: Container) {
  const bounds = target.getLocalBounds();

  const left = Math.floor(bounds.minX);
  const top = Math.floor(bounds.minY);
  const right = Math.ceil(bounds.maxX);
  const bottom = Math.ceil(bounds.maxY);
  const width = Math.max(right - left, 1);
  const height = Math.max(bottom - top, 1);

  return app.renderer.generateTexture({
    target,
    frame: new Rectangle(left, top, width, height),
    defaultAnchor: {
      x: -left / width,
      y: -top / height,
    },
  });
}

export function makeBasicCircle(
  graphic: Graphics,
  size: number,
  color: string,
  isStroke: boolean,
) {
  makeCircle(0, 0, graphic, size, color, isStroke);
}

export function makeCircle(
  x: number,
  y: number,
  graphic: Graphics,
  size: number,
  color: string,
  isStroke: boolean,
) {
  graphic.circle(x, y, size);
  if (isStroke) {
    graphic.stroke({ width: 3, color: "#000000" });
  }
  graphic.fill(color);
}
