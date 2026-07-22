import { Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import {
  getRadialPoint,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";

export class Mine extends Building {
  antennaArmsGraphics: Graphics[] = [];
  antennasParams = {
    amount: 4,
    armSize: 7,
    rotationSpeed: 0.005,
    maxRotationAngle: 0.25,
    armsAngle: 0,
    isClockwise: true,
  };

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
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);

    this.createAntennaArms();

    this.createBaseTexture();

    const base = new Sprite(Mine.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);
  }

  private createBaseTexture() {
    if (Mine.baseTexture) return;

    const baseGraphics = new Graphics();

    this.createAntennasBases(baseGraphics);

    makeBasicCircle(baseGraphics, this.baseSize, "#aaa84c", true);

    Mine.baseTexture = app.renderer.generateTexture({
      target: baseGraphics,
    });
  }

  private createAntennasBases(baseGraphics: Graphics) {
    for (let i = 0; i < this.antennasParams.amount; i++) {
      const { x: x1, y: y1 } = getRadialPoint(
        i,
        this.antennasParams.amount,
        this.baseSize,
      );
      const { x: x2, y: y2 } = getRadialPoint(
        i,
        this.antennasParams.amount,
        this.baseSize + 10,
      );

      baseGraphics.moveTo(x1, y1).lineTo(x2, y2);
    }
  }

  private createAntennaArms() {
    for (let i = 0; i < this.antennasParams.amount; i++) {
      const { x, y } = getRadialPoint(
        i,
        this.antennasParams.amount,
        this.baseSize + 10,
      );
      const { angle } = getRadialPoint(i, this.antennasParams.amount, 1);

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const xRight = -sin * this.antennasParams.armSize;
      const yRight = cos * this.antennasParams.armSize;

      const xLeft = sin * this.antennasParams.armSize;
      const yLeft = -cos * this.antennasParams.armSize;

      const perpendicular = new Graphics();

      perpendicular.position.set(x, y);

      perpendicular
        .lineTo(xRight, yRight)
        .lineTo(xLeft, yLeft)
        .stroke({ width: 3, color: "#000000" });

      this.contentContainer.addChild(perpendicular);

      this.antennaArmsGraphics[i] = perpendicular;
    }
  }

  animation(delta: number) {
    for (let i = 0; i < this.antennasParams.amount; i++) {
      const direction = this.antennasParams.isClockwise ? 1 : -1;

      for (let i = 0; i < this.antennasParams.amount; i++) {
        this.antennaArmsGraphics[i].rotation +=
          this.antennasParams.rotationSpeed * direction * delta;
      }

      this.antennasParams.armsAngle +=
        this.antennasParams.rotationSpeed * direction * delta;

      if (this.antennasParams.armsAngle > this.antennasParams.maxRotationAngle)
        this.antennasParams.isClockwise = false;
      if (this.antennasParams.armsAngle < -this.antennasParams.maxRotationAngle)
        this.antennasParams.isClockwise = true;
    }
  }
}
