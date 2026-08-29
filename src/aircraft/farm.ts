import { Graphics, Triangle, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRadialPoint, getRadialLine } from "@utils/basic-geometry";

export class Farm extends Building {
  static readonly buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 32,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 43,

    baseGraphicalSize: 40,

    minLinkLength: 120,
    maxLinkLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 1 },
    { resourceName: "Water", amount: 2 },
  ];

  static craftRecipe = {
    ingredients: [],
    result: "Metal",
  };

  // contentContainer
  // ├── antennasGraphics
  // ├── baseGraphics

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

    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      Farm.buildingConfig.baseGraphicalSize,
    );

    this.makeAntennas(
      this.antennasGraphics,
      this.antennasParams.angleOffset,
      Farm.buildingConfig.baseGraphicalSize,
      this.antennasParams.amount,
    );

    this.createBaseTexture();

    const base = new Sprite(Farm.baseTexture);
    this.contentContainer.addChild(base);
  }

  private makeAntennas(
    antennasGraphics: Graphics[],
    angleOffset: number,
    baseRadius: number,
    totalAmount: number,
    currentAmount?: number,
  ) {
    const amount = currentAmount ? currentAmount : totalAmount;

    for (let i = 0; i < amount; i++) {
      antennasGraphics[i] = new Graphics();

      const { angle } = getRadialPoint(i, totalAmount, 1);

      const cos = Math.cos(angle + angleOffset);
      const sin = Math.sin(angle + angleOffset);

      const x1 = cos * (baseRadius - 5);
      const y1 = sin * (baseRadius - 5);

      const x2 = cos * (baseRadius + 18);
      const y2 = sin * (baseRadius + 18);

      antennasGraphics[i]
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .stroke({ width: 4, color: "#000000" })
        .circle(x2, y2, 4)
        .fill("#000000");

      this.contentContainer.addChild(antennasGraphics[i]);
    }
  }

  private createBaseTexture() {
    if (Farm.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Farm.buildingConfig.baseGraphicalSize,
      "#b06667",
      true,
    );

    this.makeSpikes(baseGraphics);

    makeBasicCircle(
      baseGraphics,
      Farm.buildingConfig.baseGraphicalSize,
      "#965859",
      false,
    );

    makeBasicCircle(
      baseGraphics,
      Farm.buildingConfig.baseGraphicalSize - 5,
      "#c08484",
      false,
    );

    this.makeDecorativeTriangles(baseGraphics);

    Farm.baseTexture = generateTextureFromOrigin(baseGraphics);
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
        Farm.buildingConfig.baseGraphicalSize - 1,
        Farm.buildingConfig.baseGraphicalSize + 8,
      );

      const { x: x1, y: y1 } = getRadialPoint(
        i * 10 + 1,
        this.spikeParams.amount * 10,
        Farm.buildingConfig.baseGraphicalSize,
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
        Farm.buildingConfig.baseGraphicalSize - 1,
        Farm.buildingConfig.baseGraphicalSize + 8,
      );

      const { x: x2, y: y2 } = getRadialPoint(
        i * 10 + 9,
        this.spikeParams.amount * 10,
        Farm.buildingConfig.baseGraphicalSize,
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
      const { x, y } = getRadialPoint(
        i * 2 - 1,
        3 * 2,
        Farm.buildingConfig.baseGraphicalSize - 7,
      );
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
      const { x, y } = getRadialPoint(
        i,
        3,
        Farm.buildingConfig.baseGraphicalSize - 21,
      );
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
