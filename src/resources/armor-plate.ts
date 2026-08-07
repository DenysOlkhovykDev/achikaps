import { Graphics, Sprite } from "pixi.js";
import { Resource } from "@resources/resource";
import { app } from "../main";

export class ArmorPlate extends Resource {
  protected draw() {
    this.createBaseTexture();
    const base = new Sprite(ArmorPlate.baseTexture);
    base.anchor.set(0.5);
    this.root.addChild(base);
  }

  private createBaseTexture() {
    if (ArmorPlate.baseTexture) return;

    const graphic = new Graphics()
      .moveTo(0, -7)
      .lineTo(7, -4)
      .lineTo(6, 3)
      .lineTo(0, 7)
      .lineTo(-6, 3)
      .lineTo(-7, -4)
      .closePath()
      .fill("#7c6572")
      .stroke({ width: 2, color: "#2d2027" })
      .moveTo(-3, -3)
      .lineTo(3, 3)
      .stroke({ width: 1.5, color: "#c9a6b7" });

    ArmorPlate.baseTexture = app.renderer.generateTexture({ target: graphic });
  }
}
