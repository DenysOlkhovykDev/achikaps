import { Resource } from "@resources/resource";
import { Graphics, Sprite} from "pixi.js";
import { app } from "../main";

export class Battery extends Resource {
protected draw() {
    this.createBaseTexture();
    
    const base = new Sprite(Battery.baseTexture);
    base.anchor.set(0.5);
    this.root.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Battery.baseTexture) return;
    
    const baseGraphics = new Graphics();

    baseGraphics
      .rect(-4, -4, 6, 9)
      .stroke({ width: 3, color: "#000000" })
      .fill("#f8f8f8")
      .moveTo(-3, -5)
      .lineTo(1, -5)
      .stroke({ width: 3, color: "#000000" })
      .moveTo(-1, -2)
      .lineTo(-1, 2)
      .stroke({ width: 1, color: "#000000" })
      .moveTo(-3, 0)
      .lineTo(1, 0)
      .stroke({ width: 1, color: "#000000" });

    Battery.baseTexture = app.renderer.generateTexture({
      target: baseGraphics,
    });
  }
}
