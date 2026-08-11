import { Resource } from "@resources/resource";
import { Graphics, Sprite } from "pixi.js";
import { generateTextureFromOrigin } from "@utils/basic-graphic";

export class Organic extends Resource {
  protected draw() {
    this.createBaseTexture();

    const base = new Sprite(Organic.baseTexture);
    this.root.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Organic.baseTexture) return;

    const baseGraphics = new Graphics();

    baseGraphics
      .rect(-5, -5, 10, 10)
      .stroke({ width: 3, color: "#000000" })
      .fill("#49c461");

    Organic.baseTexture = generateTextureFromOrigin(baseGraphics);
  }
}
