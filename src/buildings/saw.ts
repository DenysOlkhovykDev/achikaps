import { Container, Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { WeaponBuilding } from "@combat/weapon-building";
import { makeBasicCircle, makeRoundShadow } from "@utils/basic-graphic";

export class Saw extends WeaponBuilding {
  private readonly blade = new Container();

  constructor(x: number, y: number) {
    super(x, y, "Saw", {
      damage: 20,
      range: 78,
      cooldown: 18,
      projectileSpeed: 0,
      projectileRadius: 0,
      projectileColor: "#ffffff",
    });
    this.draw();
  }

  protected draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);
    this.createBaseTexture();
    const base = new Sprite(Saw.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);

    const arm = new Graphics()
      .moveTo(0, 0)
      .lineTo(24, 0)
      .stroke({ width: 9, color: "#606f74", cap: "round" });
    const disk = new Graphics()
      .circle(0, 0, 16)
      .fill("#c7d0d2")
      .stroke({ width: 3, color: "#20292c" });
    for (let i = 0; i < 12; i++) {
      const tooth = new Graphics()
        .moveTo(13, -4)
        .lineTo(23, 0)
        .lineTo(13, 4)
        .closePath()
        .fill("#c7d0d2")
        .stroke({ width: 2, color: "#20292c" });
      tooth.rotation = (i / 12) * Math.PI * 2;
      this.blade.addChild(tooth);
    }
    this.blade.addChild(disk);
    this.blade.position.set(27, 0);

    const hub = new Graphics()
      .circle(0, 0, 13)
      .fill("#7f9298")
      .stroke({ width: 4, color: "#20292c" });
    this.turret.addChild(arm, this.blade, hub);
    this.contentContainer.addChild(this.turret);
    this.root.addChild(this.muzzleFlash);
  }

  private createBaseTexture() {
    if (Saw.baseTexture) return;
    const graphic = new Graphics();
    makeBasicCircle(graphic, this.baseSize, "#71858b", true);
    makeBasicCircle(graphic, this.baseSize - 9, "#aebfc3", false);
    Saw.baseTexture = app.renderer.generateTexture({ target: graphic });
  }

  animation(delta: number) {
    this.updateWeapon(delta);
    this.blade.rotation += delta * 0.22;
  }
}
