import { Container, Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
  makeGear,
} from "@utils/basic-graphic";
import { getRadialPoint } from "@utils/basic-geometry";

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

  // contentContainer
  // ├── gearSatelites
  // └── buildingBase
  //      ├── baseGraphics

  buildingBase: Container = new Container();

  buildingParams = {
    teeth: 16,
    innerRadius: Grinder.buildingConfig.baseGraphicalSize,
    outerRadius: Grinder.buildingConfig.baseGraphicalSize + 8,
    baseColor: "#c5d7d4",
    centerRadius: Grinder.buildingConfig.baseGraphicalSize - 3,
    centerColor: "#acc1bd",
    deepCenterColor: "#9eb0ac",
    rotationSpeed: 0.005,
  };

  gearSatelites: Graphics[] = [];
  gearSatelitesParams = {
    amount: 3,
    teeth: 6,
    innerRadius: 7,
    outerRadius: 14,
    baseColor: "#a3b0ae",
    centerRadius: 3,
    centerColor: "#717877",
    rotationSpeed: -((this.buildingParams.rotationSpeed * 16) / 6),
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

    this.createGearSatelites();

    this.createBaseTexture();

    const base = new Sprite(Grinder.baseTexture);
    this.buildingBase.addChild(base);
    this.contentContainer.addChild(this.buildingBase);
  }

  private createGearSatelites() {
    for (let i = 0; i < this.gearSatelitesParams.amount; i++) {
      this.gearSatelites[i] = new Graphics();

      makeGear(
        this.gearSatelites[i],
        this.gearSatelitesParams.teeth,
        this.gearSatelitesParams.innerRadius,
        this.gearSatelitesParams.outerRadius,
        this.gearSatelitesParams.baseColor,
        2,
        this.gearSatelitesParams.centerRadius,
        this.gearSatelitesParams.centerColor,
      );

      const { x, y } = getRadialPoint(
        i,
        this.gearSatelitesParams.amount,
        Grinder.buildingConfig.baseGraphicalSize,
      );

      this.gearSatelites[i].position.set(x, y);

      this.contentContainer.addChild(this.gearSatelites[i]);
    }
  }

  private createBaseTexture() {
    if (Grinder.baseTexture) return;

    const baseGraphics = new Graphics();

    makeGear(
      baseGraphics,
      this.buildingParams.teeth,
      this.buildingParams.innerRadius,
      this.buildingParams.outerRadius,
      this.buildingParams.baseColor,
      2,
      this.buildingParams.centerRadius,
      this.buildingParams.centerColor,
    );

    makeBasicCircle(
      baseGraphics,
      Grinder.buildingConfig.baseGraphicalSize - 20,
      this.buildingParams.baseColor,
      false,
    );

    makeBasicCircle(
      baseGraphics,
      Grinder.buildingConfig.baseGraphicalSize - 23,
      this.buildingParams.deepCenterColor,
      false,
    );

    Grinder.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  animation(delta: number) {
    this.buildingBase.rotation += this.buildingParams.rotationSpeed * delta;

    for (let i = 0; i < this.gearSatelitesParams.amount; i++) {
      this.gearSatelites[i].rotation +=
        this.gearSatelitesParams.rotationSpeed * delta;
    }
  }
}
