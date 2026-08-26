import { FederatedPointerEvent, Graphics, Sprite } from "pixi.js";
import { Building } from "@aircraft/building";
import { aircraft } from "@aircraft/aircraft";
import { constructionManager } from "@construction/manager";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";

export class Platform extends Building {
  onClick(event: FederatedPointerEvent) {
    aircraft.selectBuilding(this);
    super.onClick(event);
    constructionManager.showButton();
    aircraft.showCraftSigns();
  }

  constructor(x: number, y: number) {
    super(x, y, 10, "Platform");
    this.draw();
  }

  draw() {
    makeRoundShadow(this.baseRadius, "#000000", this.shadowContainer);

    this.createBaseTexture();

    const base = new Sprite(Platform.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createBaseTexture() {
    if (Platform.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(baseGraphics, this.baseRadius, "#acacac", true);

    Platform.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  animation(delta: number) {}
}
