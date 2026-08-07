import { Graphics, Sprite } from "pixi.js";
import { Resource } from "@resources/resource";
import { app } from "../main";

export class PlasticBar extends Resource {
  protected draw() {
    this.createBaseTexture();
    const base = new Sprite(PlasticBar.baseTexture);
    base.anchor.set(0.5);
    this.root.addChild(base);
  }

  private createBaseTexture() {
    if (PlasticBar.baseTexture) return;

    const graphic = new Graphics()
      .roundRect(-7, -4, 14, 8, 3)
      .fill("#e478b7")
      .stroke({ width: 2, color: "#542640" })
      .moveTo(-4, -1)
      .lineTo(4, -1)
      .stroke({ width: 1, color: "#ffd2ec", alpha: 0.8 });

    PlasticBar.baseTexture = app.renderer.generateTexture({ target: graphic });
  }
}
