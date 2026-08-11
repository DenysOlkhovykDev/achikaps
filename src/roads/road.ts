import { Graphics } from "pixi.js";
import { Building } from "@aircraft/building";

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
    const fromCenter = from.getBaseCenterInWorld();
    const toCenter = to.getBaseCenterInWorld();

    this.graphic
      .moveTo(fromCenter.x, fromCenter.y)
      .lineTo(toCenter.x, toCenter.y)
      .stroke({ width: 8, color: "#000000" });

    this.graphic.alpha = 0.5;
  }
}
