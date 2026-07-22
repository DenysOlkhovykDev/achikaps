import { Graphics, Triangle, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import {
  getRadialPoint,
  makeAntennas,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";
import { rotatePoint } from "@utils/basic-geometry";

export class Farm extends Building {
  antennasGraphics: Graphics[] = [];
  antennasParams = {
    amount: 4,
    angleOffset: Math.PI / 4,
    offsetFromCenter: 0,
    movingDirection: true,
  };

  spikeParams = {
    amount: 8,
    shape: new Triangle(-10, 0, 6, 10, 6, -10),
  };

  constructor(x: number, y: number) {
    super(x, y, 5, "Farm");
    this.draw();
    this.craft = {
      ingridients: [],
      result: "Meat",
    };
    this.priorityForTasks = 5;
    this.generateProductionTask();
  }

  draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);

    makeAntennas(
      this.contentContainer,
      this.antennasGraphics,
      this.antennasParams.angleOffset,
      this.baseSize,
      this.antennasParams.amount,
    );

    this.createBaseTexture();

    const base = new Sprite(Farm.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);
  }

  private createBaseTexture() {
    if (Farm.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(baseGraphics, this.baseSize, "#c08484", true);

    this.makeSpikes(baseGraphics);

    makeBasicCircle(baseGraphics, this.baseSize, "#c08484", false);

    makeBasicCircle(baseGraphics, this.baseSize - 10, "#c08484", false);

    baseGraphics.stroke({ width: 4, color: "#b06667" });

    Farm.baseTexture = app.renderer.generateTexture({
      target: baseGraphics,
    });
  }

  private makeSpikes(baseGraphics: Graphics) {
    for (let i = 0; i < this.spikeParams.amount; i++) {
      const {
        angle,
        x: cx,
        y: cy,
      } = getRadialPoint(i, this.spikeParams.amount, this.baseSize);

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const p1 = rotatePoint(
        this.spikeParams.shape.x,
        this.spikeParams.shape.y,
        cos,
        sin,
      );
      const p2 = rotatePoint(
        this.spikeParams.shape.x2,
        this.spikeParams.shape.y2,
        cos,
        sin,
      );
      const p3 = rotatePoint(
        this.spikeParams.shape.x3,
        this.spikeParams.shape.y3,
        cos,
        sin,
      );

      baseGraphics
        .moveTo(cx + p1.x, cy + p1.y)
        .lineTo(cx + p2.x, cy + p2.y)
        .lineTo(cx + p3.x, cy + p3.y)
        .closePath()
        .fill("#c08484");

      baseGraphics.stroke({ width: 2, color: "#000000" });
    }
  }

  animation(delta: number) {
    const direction = this.antennasParams.movingDirection ? 1 : -1;

    this.antennasParams.offsetFromCenter += 0.1 * delta * direction;

    if (this.antennasParams.offsetFromCenter > 2)
      this.antennasParams.movingDirection = false;
    if (this.antennasParams.offsetFromCenter < -2)
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
