import { Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";
import { getRadialPoint } from "@utils/basic-geometry";

export class Laboratory extends Building {
  static readonly config: BuildingConfig = {
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
    { resourceName: "Metal", amount: 1 },
    { resourceName: "Water", amount: 1 },
  ];

  static craftRecipe = {
    ingredients: [
      { resourceName: "Organic", amount: 1 },
      { resourceName: "Water", amount: 2 },
    ],
    result: "Gum",
  };

  // contentContainer
  // ├── satelitesGraphics
  // ├── baseGraphics

  satelitesGraphics: Graphics[] = [];
  satelitesParams = {
    amount: 8,
    size: 5,
    rotationSpeed: 0.05,
  };

  amountOfDecorativeCircles: number = 6;

  constructor(x: number, y: number) {
    super(x, y, 4, "Laboratory");
    this.draw();

    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  draw() {
    makeRoundShadow(
      Laboratory.config.baseGraphicalSize,
      "#000000",
      this.shadowContainer,
    );

    this.createSatelites();

    this.createBaseTexture();

    const base = new Sprite(Laboratory.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createSatelites() {
    for (let i = 0; i < this.satelitesParams.amount; i++) {
      this.satelitesGraphics[i] = new Graphics();

      const { x: cx, y: cy } = getRadialPoint(
        i,
        this.satelitesParams.amount,
        Laboratory.config.baseGraphicalSize - 5,
      );

      this.satelitesGraphics[i].position.set(cx, cy);

      for (let j = 0; j < 3; j++) {
        const { x, y } = getRadialPoint(j, 3, 10);

        this.satelitesGraphics[i]
          .moveTo(x, y)
          .circle(x, y, this.satelitesParams.size)
          .fill("#861e38")
          .stroke({ width: 2, color: "#000000" });
      }

      this.contentContainer.addChild(this.satelitesGraphics[i]);
    }
  }

  private createBaseTexture() {
    if (Laboratory.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Laboratory.config.baseGraphicalSize,
      "#cc92c3",
      true,
    );

    this.makeDecorativeCircles(baseGraphics);

    Laboratory.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private makeDecorativeCircles(baseGraphics: Graphics) {
    baseGraphics.circle(0, 0, 8).fill("#b762ac");

    for (let i = 0; i < this.amountOfDecorativeCircles; i++) {
      const { x, y } = getRadialPoint(
        i * 2 - 1,
        this.amountOfDecorativeCircles * 2,
        Laboratory.config.baseGraphicalSize - 24,
      );

      baseGraphics.circle(x, y, 6).fill("#b762ac");
    }

    for (let i = 0; i < this.amountOfDecorativeCircles; i++) {
      const { x, y } = getRadialPoint(
        i,
        this.amountOfDecorativeCircles,
        Laboratory.config.baseGraphicalSize - 12,
      );

      baseGraphics.circle(x, y, 8).fill("#b762ac");
    }
  }

  animation(delta: number) {
    for (let i = 0; i < this.satelitesParams.amount; i++) {
      this.satelitesGraphics[i].rotation +=
        this.satelitesParams.rotationSpeed * delta;
    }
  }
}
