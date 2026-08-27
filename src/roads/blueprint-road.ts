import { Graphics } from "pixi.js";
import { Building } from "@aircraft/building";

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
    const fromCenter = from.getBaseCenterInWorld();
    const toCenter = to.getBaseCenterInWorld();
    const decorationCenter = to.getBoundsCenterInWorld();

    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return;

    const dirX = dx / distance;
    const dirY = dy / distance;

    const decorationDx = decorationCenter.x - fromCenter.x;
    const decorationDy = decorationCenter.y - fromCenter.y;
    const projection = decorationDx * dirX + decorationDy * dirY;
    const perpendicularDistanceSquared =
      decorationDx * decorationDx +
      decorationDy * decorationDy -
      projection * projection;
    const radiusSquared = to.config.boundsRadius * to.config.boundsRadius;

    let effectiveDistance = distance;
    if (perpendicularDistanceSquared <= radiusSquared) {
      const distanceToIntersection = Math.sqrt(
        radiusSquared - perpendicularDistanceSquared,
      );
      effectiveDistance = Math.max(
        0,
        Math.min(distance, projection - distanceToIntersection),
      );
    }

    const step = dash + gap;
    const amount = Math.floor(effectiveDistance / step) + 1;

    for (let i = 0; i < amount; i++) {
      const start = i * step;
      const end = Math.min(start + dash, effectiveDistance);

      const x1 = fromCenter.x + dirX * start;
      const y1 = fromCenter.y + dirY * start;

      const x2 = fromCenter.x + dirX * end;
      const y2 = fromCenter.y + dirY * end;

      this.graphic.moveTo(x1, y1);
      this.graphic.lineTo(x2, y2);
    }

    this.graphic.stroke({ width: 6, color: "#000000" });
  }
}
