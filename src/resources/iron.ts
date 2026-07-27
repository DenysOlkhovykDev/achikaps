import { Resource } from "@resources/resource";
import { Graphics, Sprite} from "pixi.js";
import { app } from "../main";

export class Iron extends Resource {
  protected draw() {
    this.createBaseTexture();
    
    const base = new Sprite(Iron.baseTexture);
    base.anchor.set(0.5);
    this.root.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Iron.baseTexture) return;
    
    const baseGraphics = new Graphics();

    baseGraphics
      .rect(-5, -5, 10, 10)
      .stroke({ width: 3, color: "#000000" })
      .fill("#5bd5d3");

    Iron.baseTexture = app.renderer.generateTexture({
      target: baseGraphics,
    });
  }
}
