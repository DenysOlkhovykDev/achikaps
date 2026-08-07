import { Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import {
  getRadialPoint,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";

export class Smelter extends Building {
  buildingParams = {
    amountOfChemnies: 4,
    rotationSpeed: 0.005,
  };

  constructor(x: number, y: number) {
    super(x, y, 4, "Smelter");
    this.draw();
    this.craft = {
      ingredients: [
        { resourceName: "Meat", count: 1 },
        { resourceName: "Iron", count: 2 },
      ],
      result: "Gear",
    };
    this.priorityForTasks = 5;
    this.generateDeliveryTasks();
    this.generateProductionTask();
  }

  draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);

    this.createBaseTexture();

    const base = new Sprite(Smelter.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);
  }

  private createBaseTexture() {
    if (Smelter.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(baseGraphics, this.baseSize, "#dec6a4", true);

    this.makeChimneyPart(baseGraphics, -1, 15, 20, "#000000");
    this.makeChimneyPart(baseGraphics, -1, 14, 16, "#dec6a4");
    this.makeChimneyPart(baseGraphics, 0, 6, 6, "#da6563");
    this.makeChimneyPart(baseGraphics, 6, 14, 6, "#000000");

    const segments = 3;
    const step = (Math.PI * 2) / segments;
    const gap = 0.65;

    for (let i = 0; i < segments; i++) {
      const startAngle = i * step + gap;
      const endAngle = (i + 1) * step - gap;

      baseGraphics
        .moveTo(0, 0)
        .arc(0, 0, this.baseSize, startAngle, endAngle)
        .fill("#d4b58d");
    }

    makeBasicCircle(baseGraphics, this.baseSize - 8, "#dec6a4", false);

    makeBasicCircle(baseGraphics, this.baseSize - 18, "#dbb39e", true);

    Smelter.baseTexture = app.renderer.generateTexture({
      target: baseGraphics,
    });
  }

  private makeChimneyPart(
    baseGraphics: Graphics,
    start: number,
    end: number,
    width: number,
    color: string,
  ) {
    for (let i = 0; i < this.buildingParams.amountOfChemnies; i++) {
      const { x: x1, y: y1 } = getRadialPoint(
        i,
        this.buildingParams.amountOfChemnies,
        this.baseSize + start,
      );

      const { x: x2, y: y2 } = getRadialPoint(
        i,
        this.buildingParams.amountOfChemnies,
        this.baseSize + end,
      );

      baseGraphics.moveTo(x1, y1).lineTo(x2, y2);
    }

    baseGraphics.stroke({ width: width, color: color });
  }

  animation(delta: number) {
    this.contentContainer.rotation += this.buildingParams.rotationSpeed * delta;
  }
}
