import { Resource } from "@resources/resource";
import { Graphics, Sprite} from "pixi.js";
import { app } from "../main";

export class Meat extends Resource {
  protected draw() {
    this.createBaseTexture();
    
    const base = new Sprite(Meat.baseTexture);
    base.anchor.set(0.5);
    this.root.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Meat.baseTexture) return;
    
    const baseGraphics = new Graphics();

    baseGraphics
      .moveTo(0, -5)
      .lineTo(5, 4)
      .lineTo(-5, 4)
      .closePath()
      .stroke({ width: 3, color: "#000000" })
      .fill("#d15a53");

    Meat.baseTexture = app.renderer.generateTexture({
      target: baseGraphics,
    });
  }
}
