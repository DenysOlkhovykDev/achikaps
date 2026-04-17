import { Graphics } from "pixi.js";
import { Building } from "@buildings/building";

export class Engine extends Building {
  fire: Graphics = new Graphics();

  constructor(x: number, y: number) {
    super(x, y, 5);
    this.draw();
  }

  draw() {
    this.makeBasicCircle(this.baseSize, "#a8abdb", true);

    this.makeRoundShadow(this.baseSize);

    this.visual.addChild(this.mainGraphic);

    this.fire.moveTo(0, 0).lineTo(60, 0).stroke({ width: 4, color: "#ff0000" });

    this.visual.addChild(this.fire);
  }

  animation(delta: number, movingAngle: number) {
    this.fire.rotation = movingAngle + Math.PI;
  }
}
