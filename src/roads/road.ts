import { Graphics } from "pixi.js";
import { Building } from "../buildings/building";

export class Road {
  graphic: Graphics;

  constructor(from: Building, to: Building) {
    this.graphic = new Graphics();
    this.draw(from, to);
  }

  draw(from: Building, to: Building) {
    this.graphic.clear();

    this.graphic
      .moveTo(from.x, from.y)
      .lineTo(to.x, to.y)
      .stroke({ width: 6, color: "#000000" });
  }
}
