import { Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import { makeBasicCircle, makeRoundShadow } from "@utils/basic-graphic";

export class ArmorPress extends Building {
  private readonly leftJaw = new Graphics();
  private readonly rightJaw = new Graphics();
  private phase = 0;

  constructor(x: number, y: number) {
    super(x, y, 6, "ArmorPress");
    this.draw();
    this.craft = {
      ingredients: [{ resourceName: "Meat", count: 3 }],
      result: "ArmorPlate",
    };
    this.priorityForTasks = 5;
    this.generateDeliveryTasks();
    this.generateProductionTask();
  }

  protected draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);
    this.createBaseTexture();
    const base = new Sprite(ArmorPress.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);

    this.leftJaw
      .roundRect(-23, -13, 13, 26, 3)
      .fill("#795c6c")
      .stroke({ width: 3, color: "#2e2028" });
    this.rightJaw
      .roundRect(10, -13, 13, 26, 3)
      .fill("#795c6c")
      .stroke({ width: 3, color: "#2e2028" });
    this.contentContainer.addChild(this.leftJaw, this.rightJaw);
  }

  private createBaseTexture() {
    if (ArmorPress.baseTexture) return;
    const graphic = new Graphics();
    makeBasicCircle(graphic, this.baseSize, "#806c78", true);
    makeBasicCircle(graphic, this.baseSize - 10, "#c0acb8", false);
    graphic
      .moveTo(0, -10)
      .lineTo(9, -5)
      .lineTo(7, 8)
      .lineTo(0, 13)
      .lineTo(-7, 8)
      .lineTo(-9, -5)
      .closePath()
      .fill("#5d4653")
      .stroke({ width: 2, color: "#2e2028" });
    ArmorPress.baseTexture = app.renderer.generateTexture({ target: graphic });
  }

  animation(delta: number) {
    this.phase += delta * 0.07;
    const squeeze = Math.abs(Math.sin(this.phase)) * 7;
    this.leftJaw.x = squeeze;
    this.rightJaw.x = -squeeze;
  }
}
