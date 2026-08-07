import { Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import { makeBasicCircle, makeRoundShadow } from "@utils/basic-graphic";

export class Loom extends Building {
  private readonly shuttle = new Graphics();
  private phase = 0;

  constructor(x: number, y: number) {
    super(x, y, 6, "Loom");
    this.draw();
    this.craft = {
      ingredients: [
        { resourceName: "Meat", count: 1 },
        { resourceName: "Perl", count: 2 },
      ],
      result: "Fabric",
    };
    this.priorityForTasks = 5;
    this.generateDeliveryTasks();
    this.generateProductionTask();
  }

  protected draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);
    this.createBaseTexture();
    const base = new Sprite(Loom.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);

    this.shuttle
      .moveTo(-8, 0)
      .lineTo(0, -5)
      .lineTo(8, 0)
      .lineTo(0, 5)
      .closePath()
      .fill("#9b78d1")
      .stroke({ width: 2, color: "#3f2a62" });
    this.contentContainer.addChild(this.shuttle);
  }

  private createBaseTexture() {
    if (Loom.baseTexture) return;
    const graphic = new Graphics();
    makeBasicCircle(graphic, this.baseSize, "#9684b4", true);
    makeBasicCircle(graphic, this.baseSize - 10, "#d5c9e8", false);

    for (let x = -18; x <= 18; x += 9) {
      graphic
        .moveTo(x, -20)
        .lineTo(x, 20)
        .stroke({ width: 2, color: "#6a4d91", alpha: 0.8 });
    }
    Loom.baseTexture = app.renderer.generateTexture({ target: graphic });
  }

  animation(delta: number) {
    this.phase += delta * 0.09;
    this.shuttle.x = Math.sin(this.phase) * 21;
    this.shuttle.rotation = Math.sin(this.phase) * 0.15;
  }
}
