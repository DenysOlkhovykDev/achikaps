import { Graphics } from "pixi.js";
import { Building } from "@buildings/building";

export class BlueprintRoad {
  graphic: Graphics;

  constructor(
    public from: Building,
    public to: Building,
  ) {
    this.graphic = new Graphics();
    this.draw(from, to);
  }

  draw(from: Building, to: Building) {
    this.graphic.clear();

    this.drawDashedLine(from, to);

    this.graphic.alpha = 0.75;
  }

  public drawDashedLine(from: Building, to: Building, dash = 10, gap = 10) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const dirX = dx / distance;
    const dirY = dy / distance;

    const effectiveDistance = distance - to.baseSize;

    const step = dash + gap;
    const count = Math.floor(effectiveDistance / step) + 1;

    for (let i = 0; i < count; i++) {
      const start = i * step;
      const end = Math.min(start + dash, effectiveDistance);

      const x1 = from.x + dirX * start;
      const y1 = from.y + dirY * start;

      const x2 = from.x + dirX * end;
      const y2 = from.y + dirY * end;

      this.graphic.moveTo(x1, y1);
      this.graphic.lineTo(x2, y2);
    }

    this.graphic.stroke({ width: 6, color: "#000000" });
  }
}
