import { Resource } from "@resources/resource";
import { Graphics, Sprite} from "pixi.js";
import { app } from "../main";

export class Perl extends Resource {
  protected draw() {
    this.createBaseTexture();
    
    const base = new Sprite(Perl.baseTexture);
    base.anchor.set(0.5);
    this.root.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Perl.baseTexture) return;
    
    const baseGraphics = new Graphics();

    baseGraphics
      .circle(0, 0, 5)
      .stroke({ width: 3, color: "#000000" })
      .fill("#49c461");

    Perl.baseTexture = app.renderer.generateTexture({
      target: baseGraphics,
    });
  }
}
