import { Resource } from "@resources/resource";
import { Graphics, Sprite } from "pixi.js";
import { generateTextureFromOrigin } from "@utils/basic-graphic";

const leftSide = -6;
const rightSide = 6;
const topSide = -4;
const bottomSide = 4;
const leftJoin = -3;
const rightJoin = 3;

export class Truss extends Resource {
  protected draw() {
    this.createBaseTexture();

    const base = new Sprite(Truss.baseTexture);
    this.root.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Truss.baseTexture) return;

    const baseGraphics = new Graphics();

    baseGraphics
      .moveTo(rightSide, topSide)
      .lineTo(rightJoin, bottomSide)
      .lineTo(leftJoin, topSide)
      .lineTo(leftSide, bottomSide)
      .stroke({ width: 1.5, color: "#000000" });

    baseGraphics
      .moveTo(leftSide - 1, topSide)
      .lineTo(rightSide + 1, topSide)
      .stroke({ width: 4, color: "#000000" });

    baseGraphics
      .moveTo(leftSide, topSide)
      .lineTo(rightSide, topSide)
      .stroke({ width: 2, color: "#d1b453" });

    baseGraphics
      .moveTo(leftSide - 1, bottomSide)
      .lineTo(rightSide + 1, bottomSide)
      .stroke({ width: 4, color: "#000000" });

    baseGraphics
      .moveTo(leftSide, bottomSide)
      .lineTo(rightSide, bottomSide)
      .stroke({ width: 2, color: "#d1b453" });

    Truss.baseTexture = generateTextureFromOrigin(baseGraphics);
  }
}
