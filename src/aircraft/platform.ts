import { FederatedPointerEvent, Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import { aircraft } from "@aircraft/aircraft";
import { constructionManager } from "@construction/manager";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
} from "@utils/basic-graphic";

export class Platform extends Building {
  static readonly buildingConfig: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 32,

    boundsCenter: { x: 0, y: 0 },
    boundsRadius: 40,

    baseGraphicalSize: 40,

    minLinkLength: 120,
    maxLinkLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 1 },
    { resourceName: "Water", amount: 1 },
  ];

  constructor(x: number, y: number) {
    super(x, y, 10, "Platform");
    this.draw();
  }

  draw() {
    this.backgroundDisplay.createBasicShadow(
      Platform.buildingConfig.baseGraphicalSize,
    );

    this.createBaseTexture();

    const base = new Sprite(Platform.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createBaseTexture() {
    if (Platform.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(
      baseGraphics,
      Platform.buildingConfig.baseGraphicalSize,
      "#cccbcb",
      true,
    );

    makeBasicCircle(
      baseGraphics,
      Platform.buildingConfig.baseGraphicalSize - 10,
      "#a9a9a9",
      false,
    );

    Platform.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  animation(delta: number) {}

  onClick(event: FederatedPointerEvent) {
    aircraft.selectBuilding(this);
    super.onClick(event);
    constructionManager.showButton();
    aircraft.showCraftSigns();
  }
}
