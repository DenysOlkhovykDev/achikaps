import { Graphics, Sprite } from "pixi.js";
import { Resource } from "@resources/resource";
import { app } from "../main";

export class GlassBubble extends Resource {
  protected draw() {
    this.createBaseTexture();
    const base = new Sprite(GlassBubble.baseTexture);
    base.anchor.set(0.5);
    this.root.addChild(base);
  }

  private createBaseTexture() {
    if (GlassBubble.baseTexture) return;

    const graphic = new Graphics()
      .circle(0, 0, 6)
      .fill({ color: "#bcefff", alpha: 0.55 })
      .stroke({ width: 2, color: "#2e6f82" })
      .circle(-2, -2, 2)
      .fill({ color: "#ffffff", alpha: 0.9 });

    GlassBubble.baseTexture = app.renderer.generateTexture({ target: graphic });
  }
}
