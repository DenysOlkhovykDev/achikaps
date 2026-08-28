import { Graphics, Sprite } from "pixi.js";
import { Building, BuildingConfig } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
  makeCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";

export class GlassMaker extends Building {
  static readonly config: BuildingConfig = {
    storageCenter: { x: 0, y: 0 },
    storageRadius: 12,

    boundsCenter: { x: 15, y: 0 },
    boundsRadius: 35,

    baseGraphicalSize: 20,

    minLinkLength: 120,
    maxLinkLength: 200,
  };

  static constructionRecipe = [
    { resourceName: "Organic", amount: 1 },
    { resourceName: "Water", amount: 2 },
    { resourceName: "Metal", amount: 3 },
  ];

  constructor(x: number, y: number) {
    super(x, y, 10, "GlassMaker");
    this.draw();
  }

  draw() {
    makeRoundShadow(
      GlassMaker.config.boundsRadius,
      "#000000",
      this.shadowContainer,
    );

    this.createBaseTexture();

    const base = new Sprite(GlassMaker.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createBaseTexture() {
    if (GlassMaker.baseTexture) return;

    const base = new Graphics();

    makeCircle(
      0 + 15,
      0,
      base,
      GlassMaker.config.boundsRadius,
      "#beff74",
      false,
    );

    makeBasicCircle(base, GlassMaker.config.baseGraphicalSize, "#74f6ff", true);

    GlassMaker.baseTexture = generateTextureFromOrigin(base);
  }

  animation(delta: number) {}
}
