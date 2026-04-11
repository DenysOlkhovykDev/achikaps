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
    this.baseSize = 40;
    this.draw();
  }

  draw() {
    this.makeBasicCircle(this.baseSize, "#acacac", true);

    this.makeRoundShadow(this.baseSize);

    this.visual.addChild(this.mainGraphic);
  }

  animation() {}
}
