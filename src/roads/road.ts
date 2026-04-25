import { Graphics } from "pixi.js";
import { Building } from "@buildings/building";

export class Road {
  graphic: Graphics;

  constructor(
    public from: Building,
    public to: Building,
  ) {
    this.graphic = new Graphics();
    this.draw(from, to);
  }

  draw(from: Building, to: Building) {
    this.graphic
      .moveTo(from.x, from.y)
      .lineTo(to.x, to.y)
      .stroke({ width: 8, color: "#000000" });

    this.graphic.alpha = 0.5;
  }
}
