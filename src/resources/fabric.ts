import { Graphics, Sprite } from "pixi.js";
import { Resource } from "@resources/resource";
import { app } from "../main";

export class Fabric extends Resource {
  protected draw() {
    this.createBaseTexture();
    const base = new Sprite(Fabric.baseTexture);
    base.anchor.set(0.5);
    this.root.addChild(base);
  }

  private createBaseTexture() {
    if (Fabric.baseTexture) return;

    const graphic = new Graphics()
      .moveTo(-7, -5)
      .bezierCurveTo(-3, -8, 2, -2, 7, -5)
      .lineTo(7, 5)
      .bezierCurveTo(2, 8, -3, 2, -7, 5)
      .closePath()
      .fill("#9b78d1")
      .stroke({ width: 2, color: "#3f2a62" })
      .moveTo(-4, -1)
      .lineTo(4, -1)
      .moveTo(-4, 2)
      .lineTo(4, 2)
      .stroke({ width: 1, color: "#d9c7f2", alpha: 0.9 });

    Fabric.baseTexture = app.renderer.generateTexture({ target: graphic });
  }
}
