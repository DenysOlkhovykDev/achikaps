import { Resource } from "@resources/resource";
import { Graphics, Sprite } from "pixi.js";
import { generateTextureFromOrigin } from "@utils/basic-graphic";

export class Water extends Resource {
  protected draw() {
    this.createBaseTexture();

    const base = new Sprite(Water.baseTexture);
    this.root.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Water.baseTexture) return;

    const baseGraphics = new Graphics();

    baseGraphics
      .circle(0, 0, 5)
      .stroke({ width: 3, color: "#000000" })
      .fill("#5bd5d3");

    Water.baseTexture = generateTextureFromOrigin(baseGraphics);
  }
}
