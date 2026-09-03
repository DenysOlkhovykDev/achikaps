import { Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRadialPoint } from "@utils/basic-geometry";

export class Assembler extends Building {
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
  // ├── maniulatorsGraphics
  // ├── baseGraphics

  maniulatorsGraphics: Graphics[] = [];

  manipulatorsParams = {
    amount: 3,
    jointRadius: 5,
    jointBorderWidth: 3,

    headWidth: 2,
    handWidth: 4,
    backgroundColor: "#000000",
    baseColor: "#ffe600",

    rotation: [0.1, 0.15, 0.2],
    direction: [1, 1, 1],
    minRotation: 0,
    maxRotation: 0.2,
    speed: 0.01,
  };

  buildingParams = {
    baseColor: "#e1da8b",
    centerColor: "#b7b170",
    square: {
      x: -25,
      y: -25,
      width: 50,
      height: 50,
      radius: 5,
      color: "#ac9470",
    },
    grid: {
      gap: 11,
      length: 30,
      width: 4,
    },
  };

  constructor(x: number, y: number) {
    super(x, y, 4, "Assembler");
    this.draw();

    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      Assembler.buildingConfig.baseGraphicalSize,
    );

    this.createManipulators();

    this.createBaseTexture();

    const base = new Sprite(Assembler.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createManipulators() {
    for (let i = 0; i < 3; i++) {
      this.maniulatorsGraphics[i] = new Graphics();

      const start = getRadialPoint(
        i * 6,
        3 * 6,
        Assembler.buildingConfig.baseGraphicalSize + 2,
      );
      const middle = getRadialPoint(
        i * 6 - 1,
        3 * 6,
        Assembler.buildingConfig.baseGraphicalSize + 11,
      );
      const end = getRadialPoint(
        i * 6 - 2,
        3 * 6,
        Assembler.buildingConfig.baseGraphicalSize + 10,
      );
      const head = getRadialPoint(
        i * 6 - 2,
        3 * 6,
        Assembler.buildingConfig.baseGraphicalSize,
      );

      this.maniulatorsGraphics[i].position.set(start.x, start.y);
      this.maniulatorsGraphics[i].pivot.set(start.x, start.y);

      this.maniulatorsGraphics[i]
        .moveTo(end.x, end.y)
        .lineTo(head.x, head.y)
        .stroke({
          width: this.manipulatorsParams.headWidth,
          color: this.manipulatorsParams.backgroundColor,
        });

      this.maniulatorsGraphics[i]
        .moveTo(start.x, start.y)
        .lineTo(middle.x, middle.y)
        .lineTo(end.x, end.y)
        .stroke({
          width: this.manipulatorsParams.handWidth * 2,
          color: this.manipulatorsParams.backgroundColor,
          cap: "round",
        });

      this.maniulatorsGraphics[i]
        .moveTo(start.x, start.y)
        .lineTo(middle.x, middle.y)
        .lineTo(end.x, end.y)
        .stroke({
          width: this.manipulatorsParams.handWidth,
          color: this.manipulatorsParams.baseColor,
          cap: "round",
        });

      this.maniulatorsGraphics[i]
        .circle(start.x, start.y, this.manipulatorsParams.jointRadius)
        .fill(this.manipulatorsParams.baseColor)
        .stroke({ width: 3, color: this.manipulatorsParams.backgroundColor });

      this.maniulatorsGraphics[i]
        .circle(middle.x, middle.y, this.manipulatorsParams.jointRadius)
        .fill(this.manipulatorsParams.baseColor)
        .stroke({ width: 3, color: this.manipulatorsParams.backgroundColor });

      this.maniulatorsGraphics[i].rotation =
        this.manipulatorsParams.rotation[i];

      this.contentContainer.addChild(this.maniulatorsGraphics[i]);
    }
  }

  private createBaseTexture() {
    if (Assembler.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Assembler.buildingConfig.baseGraphicalSize,
      this.buildingParams.baseColor,
      true,
    );

    makeBasicCircle(
      baseGraphics,
      Assembler.buildingConfig.baseGraphicalSize - 6,
      this.buildingParams.centerColor,
      false,
    );

    baseGraphics
      .roundRect(
        this.buildingParams.square.x,
        this.buildingParams.square.y,
        this.buildingParams.square.width,
        this.buildingParams.square.height,
        this.buildingParams.square.radius,
      )
      .fill(this.buildingParams.square.color);

    baseGraphics
      .moveTo(-this.buildingParams.grid.gap, -this.buildingParams.grid.length)
      .lineTo(-this.buildingParams.grid.gap, this.buildingParams.grid.length)
      .moveTo(this.buildingParams.grid.gap, -this.buildingParams.grid.length)
      .lineTo(this.buildingParams.grid.gap, this.buildingParams.grid.length)
      .moveTo(-this.buildingParams.grid.length, -this.buildingParams.grid.gap)
      .lineTo(this.buildingParams.grid.length, -this.buildingParams.grid.gap)
      .moveTo(-this.buildingParams.grid.length, this.buildingParams.grid.gap)
      .lineTo(this.buildingParams.grid.length, this.buildingParams.grid.gap)
      .stroke({
        width: this.buildingParams.grid.width,
        color: this.buildingParams.centerColor,
      });

    Assembler.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  animation(delta: number) {
    for (let i = 0; i < this.maniulatorsGraphics.length; i++) {
      if (
        this.manipulatorsParams.rotation[i] <=
        this.manipulatorsParams.minRotation
      ) {
        this.manipulatorsParams.direction[i] = 1;
      } else if (
        this.manipulatorsParams.rotation[i] >=
        this.manipulatorsParams.maxRotation
      ) {
        this.manipulatorsParams.direction[i] = -1;
      }

      this.manipulatorsParams.rotation[i] +=
        this.manipulatorsParams.speed *
        delta *
        this.manipulatorsParams.direction[i];

      this.maniulatorsGraphics[i].rotation =
        this.manipulatorsParams.rotation[i];
    }
  }
}
