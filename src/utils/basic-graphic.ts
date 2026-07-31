import {
  Graphics,
  Container,
  Rectangle,
  type Renderer,
  type Texture,
} from "pixi.js";
import { getRadialPoint } from "@utils/basic-geometry";

export function generateTextureFromOrigin(
  renderer: Renderer,
  target: Container,
): Texture {
  const bounds = target.getLocalBounds();

  const left = Math.floor(bounds.minX);
  const top = Math.floor(bounds.minY);
  const right = Math.ceil(bounds.maxX);
  const bottom = Math.ceil(bounds.maxY);
  const width = Math.max(right - left, 1);
  const height = Math.max(bottom - top, 1);

  return renderer.generateTexture({
    target,
    frame: new Rectangle(left, top, width, height),
    defaultAnchor: {
      x: -left / width,
      y: -top / height,
    },
  });
}

export function makeRoundShadow(
  radius: number,
  color: string,
  shadowContainer: Container,
) {
  const shadow = new Graphics();

  shadow.circle(0, 0, radius + 2).stroke({ width: 1, color: color });

  shadow.alpha = 0.6;

  const shadow2 = new Graphics();

  shadow2.circle(0, 0, radius + 3).stroke({ width: 1, color: color });

  shadow2.alpha = 0.3;

  const shadow3 = new Graphics();

  shadow3.circle(0, 0, radius + 4).stroke({ width: 1, color: color });

  shadow3.alpha = 0.1;

  shadowContainer.addChildAt(shadow, 0);
  shadowContainer.addChildAt(shadow2, 0);
  shadowContainer.addChildAt(shadow3, 0);
}

export function makeBasicCircle(
  graphic: Graphics,
  size: number,
  color: string,
  isStroke: boolean,
) {
  graphic.circle(0, 0, size);
  if (isStroke) {
    graphic.stroke({ width: 3, color: "#000000" });
  }
  graphic.fill(color);
}

export function makeAntennas(
  contentContainer: Container,
  antennasGraphics: Graphics[],
  angleOffset: number,
  baseSize: number,
  totalAmount: number,
  currentAmount?: number,
) {
  const amount = currentAmount ? currentAmount : totalAmount;

  for (let i = 0; i < amount; i++) {
    antennasGraphics[i] = new Graphics();

    const { angle } = getRadialPoint(i, totalAmount, 1);

    const cos = Math.cos(angle + angleOffset);
    const sin = Math.sin(angle + angleOffset);

    const x1 = cos * (baseSize - 5);
    const y1 = sin * (baseSize - 5);

    const x2 = cos * (baseSize + 18);
    const y2 = sin * (baseSize + 18);

    antennasGraphics[i]
      .moveTo(x1, y1)
      .lineTo(x2, y2)
      .stroke({ width: 4, color: "#000000" })
      .circle(x2, y2, 4)
      .fill("#000000");

    contentContainer.addChild(antennasGraphics[i]);
  }
}
