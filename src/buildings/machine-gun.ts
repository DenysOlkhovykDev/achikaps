import { Container, Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { WeaponBuilding } from "@combat/weapon-building";
import { makeBasicCircle, makeRoundShadow } from "@utils/basic-graphic";

export class MachineGun extends WeaponBuilding {
  private readonly barrels = new Container();
  private spin = 0;

  constructor(x: number, y: number) {
    super(x, y, "MachineGun", {
      damage: 8,
      range: 300,
      cooldown: 12,
      projectileSpeed: 11,
      projectileRadius: 3,
      projectileColor: "#ffd45d",
    });
    this.draw();
  }

  protected draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);
    this.createBaseTexture();
    const base = new Sprite(MachineGun.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);

    for (let i = -1; i <= 1; i++) {
      const barrel = new Graphics()
        .roundRect(5, i * 7 - 2, 31, 4, 2)
        .fill("#3f4d52")
        .stroke({ width: 2, color: "#161e21" });
      this.barrels.addChild(barrel);
    }
    const hub = new Graphics()
      .circle(0, 0, 14)
      .fill("#78898f")
      .stroke({ width: 4, color: "#1d282c" });
    this.turret.addChild(this.barrels, hub);
    this.contentContainer.addChild(this.turret);
    this.root.addChild(this.muzzleFlash);
  }

  private createBaseTexture() {
    if (MachineGun.baseTexture) return;
    const graphic = new Graphics();
    makeBasicCircle(graphic, this.baseSize, "#596a71", true);
    makeBasicCircle(graphic, this.baseSize - 9, "#9eacb1", false);
    graphic
      .circle(0, 0, this.baseSize - 18)
      .stroke({ width: 3, color: "#3f5056" });
    MachineGun.baseTexture = app.renderer.generateTexture({ target: graphic });
  }

  animation(delta: number) {
    this.updateWeapon(delta);
    this.spin += delta * 0.18;
    this.barrels.y = Math.sin(this.spin) * 1.8;
  }
}
