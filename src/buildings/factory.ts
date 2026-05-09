import { Graphics } from "pixi.js";
import { Building } from "@buildings/building";
import { Perl } from "@resources/perl";
import { Battery } from "@resources/battery";

export class Factory extends Building {
  numberOfSatelites: number = 5;
  sateliteSize: number = 5;
  rotationSpeed: number = 0.005;

  satelites: Graphics = new Graphics();

  constructor(x: number, y: number) {
    super(x, y, 5);
    this.draw();
    this.craft = {
      ingridients: [],
      result: "Perl",
    };
    this.priorityForTasks = 5;
    this.genProductionTask();
  }

  draw() {
    this.makeBasicCircle(this.baseSize, "#a8d0db", true);

    const segments = 4;
    const step = (Math.PI * 2) / segments;
    const gap = 0.35;

    for (let i = 0; i < segments; i++) {
      const startAngle = i * step + gap;
      const endAngle = (i + 1) * step - gap;

      this.mainGraphic
        .moveTo(0, 0)
        .arc(0, 0, this.baseSize, startAngle, endAngle)
        .fill("#73b8b6");
    }

    this.makeBasicCircle(this.baseSize - 8, "#a8d0db", false);

    this.makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);

    this.visual.addChild(this.mainGraphic);

    for (let i = 0; i < this.numberOfSatelites; i++) {
      const { x, y } = this.getRadialPoint(
        i,
        this.numberOfSatelites,
        this.baseSize + 10,
      );

      this.satelites
        .moveTo(0, 0)
        .circle(x, y, this.sateliteSize)
        .fill("#000000");
    }
    this.visual.addChild(this.satelites);
  }

  animation(delta: number) {
    this.satelites.rotation -= this.rotationSpeed * delta;
  }

  genProductionTask() {
    this.generateProductionTask();
  }
}
