import { Graphics, Sprite } from "pixi.js";
import { Building } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";

export class GlassMaker extends Building {
  constructor(x: number, y: number) {
    super(x, y, 10, "GlassMaker");
    this.draw();
  }

  draw() {
    makeRoundShadow(this.decorativeRadius, "#000000", this.shadowContainer);

    this.createDecorativeTexture();

    const decoration = new Sprite(GlassMaker.baseTexture);
    this.contentContainer.addChild(decoration);

    const base = new Graphics();
    makeBasicCircle(base, this.baseRadius, "#74f6ff", true);
    this.resourceStorage.resourcesContainer.addChildAt(base, 0);
  }

  private createDecorativeTexture() {
    if (GlassMaker.baseTexture) return;

    const decorationGraphics = new Graphics();
    makeBasicCircle(
      decorationGraphics,
      this.decorativeRadius,
      "#beff74",
      false,
    );

    GlassMaker.baseTexture = generateTextureFromOrigin(decorationGraphics);
  }

  animation(delta: number) {}
}
