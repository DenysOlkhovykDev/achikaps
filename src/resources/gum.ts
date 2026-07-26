import { Resource } from "@resources/resource";
import { Graphics, Sprite} from "pixi.js";
import { app } from "../main";

export class Gum extends Resource {
  protected draw() {
    this.createBaseTexture();
    
    const base = new Sprite(Gum.baseTexture);
    base.anchor.set(0.5);
    this.root.addChild(base);
  }
  
  protected createBaseTexture(): void {
    if (Gum.baseTexture) return;
    
    const baseGraphics = new Graphics();

    baseGraphics
      .circle(-3, 0, 2)
      .circle(3, 0, 2)
      .rect(-2, -1, 4, 2)
      .stroke({ width: 3, color: "#000000" })
      .fill("#da315b");

    Gum.baseTexture = app.renderer.generateTexture({
      target: baseGraphics,
    });
  }
} 
