import { Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRadialLine, getRadialPoint } from "@utils/basic-geometry";

export class Grinder extends Building {
  static readonly buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 32,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 48,

    baseGraphicalSize: 40,

    minLinkLength: 120,
    maxLinkLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 3 },
    { resourceName: "Metal", amount: 1 },
  ];

  static craftRecipe = {
    ingredients: [
      { resourceName: "Water", amount: 1 },
      { resourceName: "Metal", amount: 2 },
    ],
    result: "Truss",
  };

  // contentContainer
  // ├── bladesGraphics
  // ├── baseGraphics

  maniulatorsGraphics: Graphics[] = [];

  manipulatorsParams = {
    amount: 3,
    rotation: [0.1, 0.15, 0.2],
    direction: [1, 1, 1],
  };

  constructor(x: number, y: number) {
    super(x, y, 4, "Grinder");
    this.draw();

    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      Grinder.buildingConfig.baseGraphicalSize,
    );

    this.drawTrussParts();

    this.createBaseTexture();

    const base = new Sprite(Grinder.baseTexture);
    this.contentContainer.addChild(base);
  }

  private drawTrussParts() {
    for (let i = 0; i < 3; i++) {
      this.maniulatorsGraphics[i] = new Graphics();

      const { x: x1, y: y1 } = getRadialPoint(
        i * 6,
        3 * 6,
        Grinder.buildingConfig.baseGraphicalSize + 2,
      );
      const { x: x2, y: y2 } = getRadialPoint(
        i * 6 - 1,
        3 * 6,
        Grinder.buildingConfig.baseGraphicalSize + 11,
      );
      const { x: x3, y: y3 } = getRadialPoint(
        i * 6 - 2,
        3 * 6,
        Grinder.buildingConfig.baseGraphicalSize + 10,
      );
      const { x: x4, y: y4 } = getRadialPoint(
        i * 6 - 2,
        3 * 6,
        Grinder.buildingConfig.baseGraphicalSize,
      );

      this.maniulatorsGraphics[i].position.set(x1, y1);

      this.maniulatorsGraphics[i].pivot.set(x1, y1);

      this.maniulatorsGraphics[i]
        .moveTo(x3, y3)
        .lineTo(x4, y4)
        .stroke({ width: 2, color: "#000000" });

      this.maniulatorsGraphics[i]
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .lineTo(x3, y3)
        .stroke({ width: 7, color: "#000000", cap: "round" });

      this.maniulatorsGraphics[i]
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .lineTo(x3, y3)
        .stroke({ width: 4, color: "#ffe600", cap: "round" });

      this.maniulatorsGraphics[i]
        .circle(x1, y1, 5)
        .fill("#ffe600")
        .stroke({ width: 3, color: "#000000" });

      this.maniulatorsGraphics[i]
        .circle(x2, y2, 5)
        .fill("#ffe600")
        .stroke({ width: 3, color: "#000000" });

      this.maniulatorsGraphics[i].rotation =
        this.manipulatorsParams.rotation[i];

      this.contentContainer.addChild(this.maniulatorsGraphics[i]);
    }
  }

  private createBaseTexture() {
    if (Grinder.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Grinder.buildingConfig.baseGraphicalSize,
      "#e1da8b",
      true,
    );

    makeBasicCircle(
      baseGraphics,
      Grinder.buildingConfig.baseGraphicalSize - 6,
      "#b7b170",
      false,
    );

    baseGraphics.roundRect(-25, -25, 50, 50, 5).fill("#ac9470");

    baseGraphics
      .moveTo(-11, -30)
      .lineTo(-11, 30)
      .moveTo(11, -30)
      .lineTo(11, 30)
      .moveTo(-30, -11)
      .lineTo(30, -11)
      .moveTo(-30, 11)
      .lineTo(30, 11)
      .stroke({ width: 4, color: "#b7b170" });

    Grinder.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  animation(delta: number) {
    for (let i = 0; i < this.maniulatorsGraphics.length; i++) {
      if (this.manipulatorsParams.rotation[i] <= 0) {
        this.manipulatorsParams.direction[i] = 1;
      } else if (this.manipulatorsParams.rotation[i] >= 0.2) {
        this.manipulatorsParams.direction[i] = -1;
      }

      this.manipulatorsParams.rotation[i] +=
        0.01 * delta * this.manipulatorsParams.direction[i];

      this.maniulatorsGraphics[i].rotation =
        this.manipulatorsParams.rotation[i];
    }
  }
}
