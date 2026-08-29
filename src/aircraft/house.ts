import { Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";
import { getRadialPoint } from "@utils/basic-geometry";

export class House extends Building {
  static readonly buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 17,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 30,

    baseGraphicalSize: 25,

    minLinkLength: 120,
    maxLinkLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 1 },
    { resourceName: "Water", amount: 5 },
  ];

  // contentContainer
  // ├── antennasGraphics
  // ├── baseGraphics

  antennasGraphics: Graphics[] = [];
  antennasParams = {
    totalAmount: 3,
    currentAmount: 3,
    angleOffset: Math.PI / 4,
  };

  buildingParams = {
    changeSizeDelay: 300,
    isGrowing: true,
    aircraftize: 1,
  };

  constructor(x: number, y: number) {
    super(x, y, 5, "House");
    this.draw();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      House.buildingConfig.baseGraphicalSize,
    );

    this.makeAntennas(
      this.antennasGraphics,
      this.antennasParams.angleOffset,
      House.buildingConfig.baseGraphicalSize,
      this.antennasParams.totalAmount,
      this.antennasParams.currentAmount,
    );

    this.createBaseTexture();

    const base = new Sprite(House.baseTexture);
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
    if (House.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      House.buildingConfig.baseGraphicalSize,
      "#72ac4a",
      true,
    );

    makeBasicCircle(
      baseGraphics,
      House.buildingConfig.baseGraphicalSize - 18,
      "#5b8937",
      false,
    );

    House.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private updateAntennasVisibility() {
    for (let i = 0; i < this.antennasGraphics.length; i++) {
      this.antennasGraphics[i].visible = i < this.antennasParams.currentAmount;
    }
  }

  animation(delta: number) {
    if (this.buildingParams.changeSizeDelay <= 0) {
      const direction = this.buildingParams.isGrowing ? 1 : -1;
      this.buildingParams.aircraftize += 0.01 * delta * direction;
      if (this.buildingParams.aircraftize > 1.1) {
        this.buildingParams.isGrowing = false;
        // this.antennasParams.currentAmount--;
        // this.updateAntennasVisibility();
      }
      if (this.buildingParams.aircraftize <= 1) {
        this.buildingParams.isGrowing = true;
        this.buildingParams.changeSizeDelay = 300;
      }

      this.contentContainer.scale.set(this.buildingParams.aircraftize);
    } else {
      this.buildingParams.changeSizeDelay -= delta;
    }
  }
}
