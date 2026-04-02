import { FederatedPointerEvent } from "pixi.js";
import { Building } from "./node";
import { select } from "./_buildings";

export class Platform extends Building {
  onClick(event: FederatedPointerEvent) {
    select(this);
    super.onClick(event);
  }

  constructor(x: number, y: number) {
    super(x, y, "#acacac");
  }
}
