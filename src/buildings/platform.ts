import { FederatedPointerEvent } from "pixi.js";
import { Building } from "@buildings/building";
import { select, showCrafts } from "@buildings/_buildings";
import { setIsBuildMode } from "@menus/build-menu";

export class Platform extends Building {
  onClick(event: FederatedPointerEvent) {
    select(this);
    super.onClick(event);
    setIsBuildMode(true);
    showCrafts();
  }

  constructor(x: number, y: number) {
    super(x, y, 10, "Platform");
    this.draw();
  }

  draw() {
    this.makeBasicCircle(this.baseSize, "#acacac", true);

    this.makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);

    this.visual.addChild(this.mainGraphic);
  }

  animation(delta: number) {}
}
