import { Container, Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import { generateTextureFromOrigin, makeGear } from "@utils/basic-graphic";
import { getRadialPoint } from "@utils/basic-geometry";

export class Smelter extends Building {
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

  buildingBase: Container = new Container();

  buildingParams = {
    teeth: 16,
    innerRadius: Smelter.buildingConfig.baseGraphicalSize,
    outerRadius: Smelter.buildingConfig.baseGraphicalSize + 8,
    baseColor: "#c5d7d4",
    centerRadius: Smelter.buildingConfig.baseGraphicalSize - 10,
    centerColor: "#acc1bd",
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
    super(x, y, 4, "Smelter");
    this.draw();

    this.priorityForTasks = 5;
    this.refreshTasks();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      Smelter.buildingConfig.baseGraphicalSize,
    );

    this.createGearSatelites();

    this.createBaseTexture();

    const base = new Sprite(Smelter.baseTexture);
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
        this.gearSatelitesParams.centerRadius,
        this.gearSatelitesParams.centerColor,
      );

      const { x, y } = getRadialPoint(
        i,
        this.gearSatelitesParams.amount,
        Smelter.buildingConfig.baseGraphicalSize,
      );

      this.gearSatelites[i].position.set(x, y);

      this.contentContainer.addChild(this.gearSatelites[i]);
    }
  }

  private createBaseTexture() {
    if (Smelter.baseTexture) return;

    const baseGraphics = new Graphics();

    makeGear(
      baseGraphics,
      this.buildingParams.teeth,
      this.buildingParams.innerRadius,
      this.buildingParams.outerRadius,
      this.buildingParams.baseColor,
      this.buildingParams.centerRadius,
      this.buildingParams.centerColor,
    );

    Smelter.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  animation(delta: number) {
    this.buildingBase.rotation += this.buildingParams.rotationSpeed * delta;

    for (let i = 0; i < this.gearSatelitesParams.amount; i++) {
      this.gearSatelites[i].rotation +=
        this.gearSatelitesParams.rotationSpeed * delta;
    }
  }
}
