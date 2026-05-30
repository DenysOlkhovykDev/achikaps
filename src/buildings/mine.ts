import { Graphics } from "pixi.js";
import { Building } from "@buildings/building";
import { Iron } from "@resources/iron";

export class Mine extends Building {
  numberOfAntennas: number = 4;
  antennaArmsSize: number = 7;
  rotationSpeed: number = 0.005;
  maxRotationAngle: number = 0.25;

  antennaArms: Graphics[] = [];

  rotationDirection: boolean = true;
  antennasArmsAngle: number = 0;

  constructor(x: number, y: number) {
    super(x, y, 5, "Mine");
    this.draw();
    this.craft = {
      ingridients: [],
      result: "Iron",
    };
    this.priorityForTasks = 5;
    this.generateProductionTask();
  }

  draw() {
    this.makeBasicCircle(this.baseSize, "#aaa84c", true);

    this.makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);

    for (let i = 0; i < this.numberOfAntennas; i++) {
      this.drawAntena(i);
    }
    this.mainGraphic.stroke({ width: 3, color: "#000000" });

    this.visual.addChild(this.mainGraphic);
  }

  private drawAntena(i: number) {
    const { x: x1, y: y1 } = this.getRadialPoint(
      i,
      this.numberOfAntennas,
      this.baseSize,
    );
    const { x: x2, y: y2 } = this.getRadialPoint(
      i,
      this.numberOfAntennas,
      this.baseSize + 10,
    );

    this.mainGraphic.moveTo(x1, y1).lineTo(x2, y2);

    const { angle } = this.getRadialPoint(i, this.numberOfAntennas, 1);

    this.antennaArms[i] = this.createPerpendicular(x2, y2, angle);
  }

  private createPerpendicular(x: number, y: number, angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const xRight = -sin * this.antennaArmsSize;
    const yRight = cos * this.antennaArmsSize;

    const xLeft = sin * this.antennaArmsSize;
    const yLeft = -cos * this.antennaArmsSize;

    const perpendicular = new Graphics();

    perpendicular.position.set(x, y);

    perpendicular
      .lineTo(xRight, yRight)
      .lineTo(xLeft, yLeft)
      .stroke({ width: 3, color: "#000000" });

    this.visual.addChild(perpendicular);

    return perpendicular;
  }

  animation(delta: number) {
    for (let i = 0; i < this.numberOfAntennas; i++) {
      const direction = this.rotationDirection ? 1 : -1;

      for (let i = 0; i < this.numberOfAntennas; i++) {
        this.antennaArms[i].rotation += this.rotationSpeed * direction * delta;
      }

      this.antennasArmsAngle += this.rotationSpeed * direction * delta;

      if (this.antennasArmsAngle > this.maxRotationAngle)
        this.rotationDirection = false;
      if (this.antennasArmsAngle < -this.maxRotationAngle)
        this.rotationDirection = true;
    }
  }
}
