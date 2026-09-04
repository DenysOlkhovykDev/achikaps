import { Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRadialPoint, getRadialLine } from "@utils/basic-geometry";

export class Collector extends Building {
  static readonly buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 32,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 45,

    baseGraphicalSize: 40,

    minLinkLength: 120,
    maxLinkLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 2 },
    { resourceName: "Water", amount: 1 },
  ];

  static craftRecipe = {
    ingredients: [],
    result: "Water",
  };

  // contentContainer
  // ├── gridsGraphics
  // ├── baseGraphics

  gridsGraphics: Graphics = new Graphics();
  gridsParams = {
    amount: 3,
    sizes: [6.5, 12, 12],
    angleOffsets: { small: 1.05, medium: 0.5 },
    rotationSpeed: 0.005,
  };

  constructor(x: number, y: number) {
    super(x, y, 5, "Collector");
    this.draw();
    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      Collector.buildingConfig.baseGraphicalSize,
    );

    this.createSatelites();

    this.createBaseTexture();

    const base = new Sprite(Collector.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createSatelites() {
    for (let i = 0; i < this.gridsParams.amount; i++) {
      const small = getRadialLine(
        i * 4 + 2,
        this.gridsParams.amount * 4,
        Collector.buildingConfig.baseGraphicalSize,
        Collector.buildingConfig.baseGraphicalSize + this.gridsParams.sizes[0],
      );

      const medium = getRadialLine(
        i * 4 + 1,
        this.gridsParams.amount * 4,
        Collector.buildingConfig.baseGraphicalSize,
        Collector.buildingConfig.baseGraphicalSize + this.gridsParams.sizes[1],
      );

      const large = getRadialLine(
        i * 4,
        this.gridsParams.amount * 4,
        Collector.buildingConfig.baseGraphicalSize,
        Collector.buildingConfig.baseGraphicalSize + this.gridsParams.sizes[2],
      );

      this.gridsGraphics
        .moveTo(small.startX, small.startY)
        .lineTo(small.endX, small.endY)
        .moveTo(medium.startX, medium.startY)
        .lineTo(medium.endX, medium.endY)
        .moveTo(large.startX, large.startY)
        .lineTo(large.endX, large.endY)
        .moveTo(small.endX, small.endY)
        .arc(
          0,
          0,
          Collector.buildingConfig.baseGraphicalSize +
            this.gridsParams.sizes[0],
          small.angle,
          small.angle - this.gridsParams.angleOffsets.small,
          true,
        )
        .moveTo(medium.endX, medium.endY)
        .arc(
          0,
          0,
          Collector.buildingConfig.baseGraphicalSize +
            this.gridsParams.sizes[1],
          medium.angle,
          medium.angle - this.gridsParams.angleOffsets.medium,
          true,
        )
        .stroke({ width: 3, color: "#173b67", cap: "round" });
    }
    this.contentContainer.addChild(this.gridsGraphics);
  }

  private createBaseTexture() {
    if (Collector.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Collector.buildingConfig.baseGraphicalSize,
      "#a8d0db",
      true,
    );

    const points = [];
    for (let i = 0; i < 3; i++) {
      const { x, y } = getRadialPoint(
        i,
        3,
        Collector.buildingConfig.baseGraphicalSize - 16,
      );
      points.push({ x, y });
    }

    baseGraphics
      .moveTo(points[0].x, points[0].y)
      .lineTo(points[1].x, points[1].y)
      .lineTo(points[2].x, points[2].y)
      .closePath();
    baseGraphics.stroke({ width: 8, color: "#6ba6de", cap: "round" });

    for (let i = 0; i < 3; i++) {
      baseGraphics.circle(points[i].x, points[i].y, 12).fill("#81bcf3");
    }

    Collector.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  animation(delta: number) {
    this.gridsGraphics.rotation -= this.gridsParams.rotationSpeed * delta;
  }
}
