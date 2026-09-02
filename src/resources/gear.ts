import { Resource } from "@resources/resource";
import { Graphics, Sprite } from "pixi.js";
import { generateTextureFromOrigin, makeGear } from "@utils/basic-graphic";

export class Gear extends Resource {
  protected draw() {
    this.createBaseTexture();

    const base = new Sprite(Gear.baseTexture);
    this.root.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Gear.baseTexture) return;

    const baseGraphics = new Graphics();

    baseGraphics.clear();

    makeGear(baseGraphics, 6, 4.5, 7, "#bdd2d3", 2.25, "#000000");

    Gear.baseTexture = generateTextureFromOrigin(baseGraphics);
  }
}
