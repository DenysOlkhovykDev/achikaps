import { Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { WeaponBuilding } from "@combat/weapon-building";
import { CombatTarget } from "@combat/combat";
import { makeBasicCircle, makeRoundShadow } from "@utils/basic-graphic";

export class Cannon extends WeaponBuilding {
  private readonly barrel = new Graphics();
  private recoil = 0;

  constructor(x: number, y: number) {
    super(x, y, "Cannon", {
      damage: 35,
      range: 360,
      cooldown: 90,
      projectileSpeed: 6,
      projectileRadius: 6,
      projectileColor: "#343b3e",
    });
    this.draw();
  }

  protected draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);
    this.createBaseTexture();
    const base = new Sprite(Cannon.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);

    this.barrel
      .roundRect(0, -8, 34, 16, 5)
      .fill("#56666c")
      .stroke({ width: 4, color: "#202a2e" })
      .roundRect(28, -11, 9, 22, 3)
      .fill("#303b40")
      .stroke({ width: 3, color: "#151c1f" });
    const hub = new Graphics()
      .circle(0, 0, 15)
      .fill("#82949a")
      .stroke({ width: 4, color: "#202a2e" });
    this.turret.addChild(this.barrel, hub);
    this.contentContainer.addChild(this.turret);
    this.root.addChild(this.muzzleFlash);
  }

  private createBaseTexture() {
    if (Cannon.baseTexture) return;
    const graphic = new Graphics();
    makeBasicCircle(graphic, this.baseSize, "#687980", true);
    makeBasicCircle(graphic, this.baseSize - 9, "#aebbc0", false);
    Cannon.baseTexture = app.renderer.generateTexture({ target: graphic });
  }

  protected fire(target: CombatTarget) {
    super.fire(target);
    this.recoil = 9;
  }

  animation(delta: number) {
    this.updateWeapon(delta);
    this.recoil = Math.max(0, this.recoil - delta * 0.45);
    this.barrel.x = -this.recoil;
  }
}
