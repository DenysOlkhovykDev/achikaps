import { Graphics, Sprite } from "pixi.js";
import { Resource } from "@resources/resource";
import { app } from "../main";

export class Steel extends Resource {
  protected draw() {
    this.createBaseTexture();
    const base = new Sprite(Steel.baseTexture);
    base.anchor.set(0.5);
    this.root.addChild(base);
  }

  private createBaseTexture() {
    if (Steel.baseTexture) return;

    const graphic = new Graphics()
      .moveTo(0, -7)
      .lineTo(7, 0)
      .lineTo(0, 7)
      .lineTo(-7, 0)
      .closePath()
      .fill("#f29a38")
      .stroke({ width: 2.5, color: "#5e3215" })
      .moveTo(0, -4)
      .lineTo(4, 0)
      .stroke({ width: 1.5, color: "#ffd18d" });

    Steel.baseTexture = app.renderer.generateTexture({ target: graphic });
  }
}
