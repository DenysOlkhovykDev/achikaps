import { FederatedPointerEvent, Graphics, Sprite } from "pixi.js";
import { Building } from "@buildings/building";
import { select, showCrafts } from "@buildings/_buildings";
import { setIsBuildMode } from "@menus/build-menu";
import { app } from "../main";
import { makeBasicCircle, makeRoundShadow } from "@utils/basic-graphic";

export class Platform extends Building {
  onClick(event: FederatedPointerEvent) {
    select(this);
    super.onClick(event);
    setIsBuildMode(true);
    showCrafts();
  }

  constructor(x: number, y: number) {
    super(x, y, 10, "Platform");
    this.draw();
  }

  draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);

    this.createBaseTexture();

    const base = new Sprite(Platform.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);
  }

  private createBaseTexture() {
    if (Platform.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(baseGraphics, this.baseSize, "#acacac", true);

    Platform.baseTexture = app.renderer.generateTexture({
      target: baseGraphics,
    });
  }

  animation(delta: number) {}
}
