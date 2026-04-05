import { FederatedPointerEvent, Graphics } from "pixi.js";
import { Building } from "@buildings/building";
import { select } from "@buildings/_buildings";

export class Platform extends Building {
  onClick(event: FederatedPointerEvent) {
    select(this);
    super.onClick(event);
  }

  constructor(x: number, y: number) {
    super(x, y, 10);
    this.draw();
  }

  draw() {
    const graphic = new Graphics();

    graphic
      .circle(0, 0, 40)
      .stroke({ width: 3, color: "#000000" })
      .fill("#acacac");

    this.makeRoundShadow(42);
    this.visual.addChild(graphic);
  }

  animation() {}
}
