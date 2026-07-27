import { Resource } from "@resources/resource";
import { Graphics, Sprite} from "pixi.js";
import { app } from "../main";

export class Gear extends Resource {
  protected draw() {
    this.createBaseTexture();
    
    const base = new Sprite(Gear.baseTexture);
    base.anchor.set(0.5);
    this.root.addChild(base);
  }

  protected createBaseTexture(): void {
    if (Gear.baseTexture) return;
      
    const baseGraphics = new Graphics();
  
    const teeth = 6;
    const innerRadius = 4;
    const outerRadius = 6;
    const angleOffset = Math.PI / 10.5;

    baseGraphics.clear();

    const points: number[] = [];

    for (let i = 0; i < teeth; i++) {
      const baseAngle = (i / teeth) * Math.PI * 2;

      const step = (Math.PI * 2) / teeth;

      let angle = baseAngle;
      points.push(Math.cos(angle+angleOffset) * outerRadius, Math.sin(angle+angleOffset) * outerRadius);

      angle = baseAngle + step * 0.3;
      points.push(Math.cos(angle+angleOffset) * outerRadius, Math.sin(angle+angleOffset) * outerRadius);

      angle = baseAngle + step * 0.65;
      points.push(Math.cos(angle+angleOffset) * innerRadius, Math.sin(angle+angleOffset) * innerRadius);
    }

    baseGraphics
      .poly(points)
      .fill("#89a8b5")
      .stroke({ width: 1.25, color: "#000000" });

    baseGraphics.circle(0, 0, 2).fill("#000000");
  
    Gear.baseTexture = app.renderer.generateTexture({
      target: baseGraphics,
    });
  }
}
