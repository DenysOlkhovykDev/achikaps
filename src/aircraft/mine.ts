import { Graphics, Sprite } from "pixi.js";
import { Building } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";
import { getRadialLine, getRadialPoint } from "@utils/basic-geometry";

export class Mine extends Building {
  kelpLeavesGraphics: Graphics[] = [];
  kelpTrunksGraphics: Graphics = new Graphics();
  kelpsParams = {
    amount: 4,
    leavesSize: 16,
    leavesWidth: 20,
    leafSegments: 6,
    movingSpeed: 0.05,
    maxAmplitude: 3,
    kelpTime: 0,
  };

  private kelpLeavesPoints: {
    xRight: number;
    yRight: number;
    xLeft: number;
    yLeft: number;
  }[] = [];

  constructor(x: number, y: number) {
    super(x, y, 5, "Mine");
    this.draw();
    this.craft = {
      ingredients: [],
      result: "Organic",
    };
    this.priorityForTasks = 5;
    this.generateProductionTask();
  }

  draw() {
    makeRoundShadow(this.baseRadius, "#000000", this.shadowContainer);

    this.createKelpLeaves();

    this.createBaseTexture();

    const base = new Sprite(Mine.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createBaseTexture() {
    if (Mine.baseTexture) return;

    const baseGraphics = new Graphics();

    this.createKelpTrunks(baseGraphics);

    makeBasicCircle(baseGraphics, this.baseRadius, "#a3791f", true);
    makeBasicCircle(baseGraphics, this.baseRadius - 2, "#c1bf4e", false);

    this.createDecorativePlant(baseGraphics);

    Mine.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private createKelpLeaves() {
    for (let i = 0; i < this.kelpsParams.amount; i++) {
      const { angle, x, y } = getRadialPoint(
        i,
        this.kelpsParams.amount,
        this.baseRadius - 6,
      );

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      this.kelpLeavesPoints[i] = {
        xRight: -sin * this.kelpsParams.leavesSize,
        yRight: cos * this.kelpsParams.leavesSize,
        xLeft: sin * this.kelpsParams.leavesSize,
        yLeft: -cos * this.kelpsParams.leavesSize,
      };

      const graphics = new Graphics();
      graphics.position.set(x, y);

      this.contentContainer.addChild(graphics);
      this.kelpLeavesGraphics[i] = graphics;
    }
    this.animation(0);
  }

  private createKelpTrunks(baseGraphics: Graphics) {
    for (let i = 0; i < this.kelpsParams.amount; i++) {
      const line = getRadialLine(
        i,
        this.kelpsParams.amount,
        this.baseRadius,
        this.baseRadius + 3,
      );

      baseGraphics
        .moveTo(line.startX, line.startY)
        .lineTo(line.endX, line.endY)
        .stroke({ width: 4, color: "#34612c", cap: "round" });
    }
  }

  private createDecorativePlant(baseGraphics: Graphics) {
    makeBasicCircle(baseGraphics, this.baseRadius - 18, "#77c06a", false);

    for (let i = 0; i < 5; i++) {
      const { x: x1, y: y1 } = getRadialPoint(
        i * 5 - 1,
        5 * 5,
        this.baseRadius - 20,
      );

      baseGraphics.circle(x1, y1, 8).fill("#67a75c");

      const { x: x2, y: y2 } = getRadialPoint(
        i * 5 + 1,
        5 * 5,
        this.baseRadius - 20,
      );

      baseGraphics.circle(x2, y2, 8).fill("#67a75c");

      baseGraphics
        .moveTo(0, 0)
        .lineTo(x1, y1)
        .lineTo(x2, y2)
        .closePath()
        .fill("#67a75c");
    }
  }

  animation(delta: number) {
    this.kelpsParams.kelpTime += delta * this.kelpsParams.movingSpeed;

    for (let i = 0; i < this.kelpsParams.amount; i++) {
      this.kelpLeavesGraphics[i].clear();

      this.makeLeaf(
        this.kelpLeavesGraphics[i],
        i,
        this.kelpLeavesPoints[i].xRight,
        this.kelpLeavesPoints[i].yRight,
      );
      this.makeLeaf(
        this.kelpLeavesGraphics[i],
        i,
        this.kelpLeavesPoints[i].xLeft,
        this.kelpLeavesPoints[i].yLeft,
      );

      this.kelpLeavesGraphics[i].stroke({
        width: this.kelpsParams.leavesWidth,
        color: "#559c48",
        cap: "round",
        join: "round",
      });
    }
  }

  private makeLeaf(
    leafGraphics: Graphics,
    index: number,
    endX: number,
    endY: number,
  ) {
    const length = Math.hypot(endX, endY);

    const dx = endX / length;
    const dy = endY / length;

    const nx = -dy;
    const ny = dx;

    leafGraphics.moveTo(0, 0);

    for (let j = 1; j <= this.kelpsParams.leafSegments; j++) {
      const t = j / this.kelpsParams.leafSegments;

      const px = dx * length * t;
      const py = dy * length * t;

      const localAmplitude = this.kelpsParams.maxAmplitude * t * t;

      const offset =
        Math.sin(this.kelpsParams.kelpTime + t * Math.PI * 2 + index * 0.35) *
        localAmplitude;

      leafGraphics.lineTo(px + nx * offset, py + ny * offset);
    }
  }
}
