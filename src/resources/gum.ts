import { Resource } from "@resources/resource";
import { Graphics, Sprite } from "pixi.js";
import { generateTextureFromOrigin } from "@utils/basic-graphic";

export class Gum extends Resource {
  protected draw() {
    this.createBaseTexture();

    const base = new Sprite(Gum.baseTexture);
    this.root.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Gum.baseTexture) return;

    const baseGraphics = new Graphics();

    baseGraphics
      .circle(-3.5, 0, 2.5)
      .circle(3.5, 0, 2.5)
      .rect(-2, -1, 4, 2)
      .stroke({ width: 3, color: "#000000" })
      .fill("#da315b");

    Gum.baseTexture = generateTextureFromOrigin(baseGraphics);
  }
}
