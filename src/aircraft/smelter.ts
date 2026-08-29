import { Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRadialLine } from "@utils/basic-geometry";

export class Smelter extends Building {
  static readonly buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 32,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 50,

    baseGraphicalSize: 40,

    minLinkLength: 120,
    maxLinkLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 2 },
    { resourceName: "Water", amount: 2 },
  ];

  static craftRecipe = {
    ingredients: [
      { resourceName: "Metal", amount: 1 },
      { resourceName: "Organic", amount: 2 },
    ],
    result: "Gear",
  };

  buildingParams = {
    amountOfChemnies: 4,
    rotationSpeed: 0.005,
  };

  constructor(x: number, y: number) {
    super(x, y, 4, "Smelter");
    this.draw();

    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      Smelter.buildingConfig.baseGraphicalSize,
    );

    this.createBaseTexture();

    const base = new Sprite(Smelter.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createBaseTexture() {
    if (Smelter.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Smelter.buildingConfig.baseGraphicalSize,
      "#dec6a4",
      true,
    );

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
        .arc(
          0,
          0,
          Smelter.buildingConfig.baseGraphicalSize,
          startAngle,
          endAngle,
        )
        .fill("#d4b58d");
    }

    makeBasicCircle(
      baseGraphics,
      Smelter.buildingConfig.baseGraphicalSize - 8,
      "#dec6a4",
      false,
    );

    makeBasicCircle(
      baseGraphics,
      Smelter.buildingConfig.baseGraphicalSize - 18,
      "#dbb39e",
      true,
    );

    Smelter.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private makeChimneyPart(
    baseGraphics: Graphics,
    start: number,
    end: number,
    width: number,
    color: string,
  ) {
    for (let i = 0; i < this.buildingParams.amountOfChemnies; i++) {
      const line = getRadialLine(
        i,
        this.buildingParams.amountOfChemnies,
        Smelter.buildingConfig.baseGraphicalSize + start,
        Smelter.buildingConfig.baseGraphicalSize + end,
      );

      baseGraphics
        .moveTo(line.startX, line.startY)
        .lineTo(line.endX, line.endY);
    }

    baseGraphics.stroke({ width: width, color: color });
  }

  animation(delta: number) {
    this.contentContainer.rotation += this.buildingParams.rotationSpeed * delta;
  }
}
