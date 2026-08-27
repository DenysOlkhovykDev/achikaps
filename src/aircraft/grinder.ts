import { Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";
import { getRadialPoint } from "@utils/basic-geometry";

export class Grinder extends Building {
  static readonly config: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 32,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 43,

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

  bladesGraphics: Graphics[] = [];
  bladesParams = {
    amount: 4,
    rotationSpeed: 0.05,
  };

  constructor(x: number, y: number) {
    super(x, y, 4, "Grinder");
    this.draw();

    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  draw() {
    makeRoundShadow(
      Grinder.config.baseGraphicalSize,
      "#000000",
      this.shadowContainer,
    );

    this.createBlades();

    this.createBaseTexture();

    const base = new Sprite(Grinder.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createBlades() {
    for (let i = 0; i < this.bladesParams.amount; i++) {
      this.bladesGraphics[i] = new Graphics();

      const { x, y } = getRadialPoint(
        i,
        this.bladesParams.amount,
        Grinder.config.baseGraphicalSize + 4,
      );

      this.bladesGraphics[i].position.set(x, y);

      this.bladesGraphics[i]
        .moveTo(0, 0)
        .lineTo(0, -8)
        .lineTo(2, -6)
        .lineTo(4, 0)
        .closePath();
      this.bladesGraphics[i]
        .moveTo(0, 0)
        .lineTo(-8, 0)
        .lineTo(-6, -2)
        .lineTo(0, -4)
        .closePath();
      this.bladesGraphics[i]
        .moveTo(0, 0)
        .lineTo(8, 0)
        .lineTo(6, 2)
        .lineTo(0, 4)
        .closePath();
      this.bladesGraphics[i]
        .moveTo(0, 0)
        .lineTo(0, 8)
        .lineTo(-2, 6)
        .lineTo(-4, 0)
        .closePath();

      this.bladesGraphics[i].stroke({
        width: 1,
        color: "#000000",
        cap: "round",
      });
      this.bladesGraphics[i].fill("#000000");

      this.contentContainer.addChild(this.bladesGraphics[i]);
    }
  }

  private createBaseTexture() {
    if (Grinder.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Grinder.config.baseGraphicalSize,
      "#d2aa8a",
      true,
    );

    this.makeBladeConnectors(baseGraphics);

    makeBasicCircle(
      baseGraphics,
      Grinder.config.baseGraphicalSize - 12,
      "#846c5b",
      false,
    );
    makeBasicCircle(
      baseGraphics,
      Grinder.config.baseGraphicalSize - 14,
      "#ce9e81",
      false,
    );

    Grinder.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private makeBladeConnectors(baseGraphics: Graphics) {
    for (let i = 0; i < this.bladesParams.amount; i++) {
      const { x: x1, y: y1 } = getRadialPoint(
        i,
        this.bladesParams.amount,
        Grinder.config.baseGraphicalSize - 14,
      );

      const { x: x2, y: y2 } = getRadialPoint(
        i,
        this.bladesParams.amount,
        Grinder.config.baseGraphicalSize + 2,
      );

      baseGraphics.moveTo(x1, y1).lineTo(x2, y2);
    }
    baseGraphics.stroke({ width: 8, color: "#bd8e67", cap: "round" });
  }

  animation(delta: number) {
    for (let i = 0; i < this.bladesParams.amount; i++) {
      this.bladesGraphics[i].rotation +=
        this.bladesParams.rotationSpeed * delta;
    }
  }
}
