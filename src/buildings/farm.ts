import { Graphics, Triangle, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import {
  generateTextureFromOrigin,
  makeAntennas,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";
import {
  getRadialPoint,
  getRadialLine,
  rotatePoint,
} from "@utils/basic-geometry";

export class Farm extends Building {
  antennasGraphics: Graphics[] = [];
  antennasParams = {
    amount: 4,
    angleOffset: Math.PI / 4,
    offsetFromCenter: 0,
    movingDirection: true,
  };

  spikeParams = {
    amount: 4,
    shape: new Triangle(-10, 0, 6, 10, 6, -10),
  };

  constructor(x: number, y: number) {
    super(x, y, 5, "Farm");
    this.draw();
    this.craft = {
      ingridients: [],
      result: "Metal",
    };
    this.priorityForTasks = 5;
    this.generateProductionTask();
  }

  draw() {
    makeRoundShadow(this.baseRadius, "#000000", this.shadowContainer);

    makeAntennas(
      this.contentContainer,
      this.antennasGraphics,
      this.antennasParams.angleOffset,
      this.baseRadius,
      this.antennasParams.amount,
    );

    this.createBaseTexture();

    const base = new Sprite(Farm.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createBaseTexture() {
    if (Farm.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(baseGraphics, this.baseRadius, "#b06667", true);

    this.makeSpikes(baseGraphics);

    makeBasicCircle(baseGraphics, this.baseRadius, "#965859", false);

    makeBasicCircle(baseGraphics, this.baseRadius - 5, "#c08484", false);

    this.makeDecorativeTriangles(baseGraphics);

    Farm.baseTexture = generateTextureFromOrigin(app.renderer, baseGraphics);
  }

  private makeSpikes(baseGraphics: Graphics) {
    for (let i = 0; i < this.spikeParams.amount; i++) {
      const {
        startX: sx,
        startY: sy,
        endX: ex,
        endY: ey,
      } = getRadialLine(
        i * 10 + 4,
        this.spikeParams.amount * 10,
        this.baseRadius - 1,
        this.baseRadius + 8,
      );

      const { x: x1, y: y1 } = getRadialPoint(
        i * 10 + 1,
        this.spikeParams.amount * 10,
        this.baseRadius,
      );

      baseGraphics
        .moveTo(sx, sy)
        .lineTo(ex, ey)
        .lineTo(x1, y1)
        .closePath()
        .fill("#b06667");

      baseGraphics.stroke({ width: 2, color: "#000000" });

      const {
        startX: sx2,
        startY: sy2,
        endX: ex2,
        endY: ey2,
      } = getRadialLine(
        i * 10 + 6,
        this.spikeParams.amount * 10,
        this.baseRadius - 1,
        this.baseRadius + 8,
      );

      const { x: x2, y: y2 } = getRadialPoint(
        i * 10 + 9,
        this.spikeParams.amount * 10,
        this.baseRadius,
      );

      baseGraphics
        .moveTo(sx2, sy2)
        .lineTo(ex2, ey2)
        .lineTo(x2, y2)
        .closePath()
        .fill("#b06667");

      baseGraphics.stroke({ width: 2, color: "#000000" });
    }
  }

  private makeDecorativeTriangles(baseGraphics: Graphics) {
    const points = [];
    for (let i = 0; i < 3; i++) {
      const { x, y } = getRadialPoint(i * 2 - 1, 3 * 2, this.baseRadius - 7);
      points.push({ x, y });
    }

    baseGraphics
      .moveTo(points[0].x, points[0].y)
      .lineTo(points[1].x, points[1].y)
      .lineTo(points[2].x, points[2].y)
      .closePath()
      .fill("#b06667");

    const points2 = [];
    for (let i = 0; i < 3; i++) {
      const { x, y } = getRadialPoint(i, 3, this.baseRadius - 21);
      points2.push({ x, y });
    }

    baseGraphics
      .moveTo(points2[0].x, points2[0].y)
      .lineTo(points2[1].x, points2[1].y)
      .lineTo(points2[2].x, points2[2].y)
      .closePath()
      .fill("#c08484");
  }

  animation(delta: number) {
    const direction = this.antennasParams.movingDirection ? 1 : -1;

    this.antennasParams.offsetFromCenter += 0.1 * delta * direction;

    if (this.antennasParams.offsetFromCenter > -2)
      this.antennasParams.movingDirection = false;
    if (this.antennasParams.offsetFromCenter < -12)
      this.antennasParams.movingDirection = true;

    for (let i = 0; i < this.antennasParams.amount; i++) {
      const { angle } = getRadialPoint(i, this.antennasParams.amount, 1);

      const cos = Math.cos(angle + this.antennasParams.angleOffset);
      const sin = Math.sin(angle + this.antennasParams.angleOffset);

      const x1 = cos * this.antennasParams.offsetFromCenter;
      const y1 = sin * this.antennasParams.offsetFromCenter;

      this.antennasGraphics[i].position.set(x1, y1);
    }
  }
}
