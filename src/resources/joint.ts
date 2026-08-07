import { Graphics, Sprite } from "pixi.js";
import { Resource } from "@resources/resource";
import { app } from "../main";

export class Joint extends Resource {
  protected draw() {
    this.createBaseTexture();
    const base = new Sprite(Joint.baseTexture);
    base.anchor.set(0.5);
    this.root.addChild(base);
  }

  private createBaseTexture() {
    if (Joint.baseTexture) return;

    const graphic = new Graphics()
      .moveTo(-3, 0)
      .lineTo(3, 0)
      .stroke({ width: 4, color: "#4b5961" })
      .circle(-5, 0, 4)
      .fill("#b9c6ca")
      .stroke({ width: 2, color: "#253139" })
      .circle(5, 0, 4)
      .fill("#b9c6ca")
      .stroke({ width: 2, color: "#253139" })
      .circle(-5, 0, 1.2)
      .circle(5, 0, 1.2)
      .fill("#253139");

    Joint.baseTexture = app.renderer.generateTexture({ target: graphic });
  }
}
