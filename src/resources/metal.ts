import { Resource } from "@resources/resource";
import { Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { generateTextureFromOrigin } from "@utils/basic-graphic";

export class Metal extends Resource {
  protected draw() {
    this.createBaseTexture();

    const base = new Sprite(Metal.baseTexture);
    this.root.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Metal.baseTexture) return;

    const baseGraphics = new Graphics();

    baseGraphics
      .moveTo(0, -4)
      .lineTo(5, 5)
      .lineTo(-5, 5)
      .closePath()
      .stroke({ width: 3, color: "#000000" })
      .fill("#d15a53");

    Metal.baseTexture = generateTextureFromOrigin(app.renderer, baseGraphics);
  }
}
