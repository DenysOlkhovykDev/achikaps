import { Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import { makeBasicCircle, makeRoundShadow } from "@utils/basic-graphic";

export class Workshop extends Building {
  private readonly press = new Graphics();
  private phase = 0;

  constructor(x: number, y: number) {
    super(x, y, 6, "Workshop");
    this.draw();
    this.craft = {
      ingredients: [{ resourceName: "Iron", count: 3 }],
      result: "PlasticBar",
    };
    this.priorityForTasks = 5;
    this.generateDeliveryTasks();
    this.generateProductionTask();
  }

  protected draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);
    this.createBaseTexture();
    const base = new Sprite(Workshop.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);

    this.press
      .rect(-14, -8, 28, 7)
      .fill("#e478b7")
      .stroke({ width: 3, color: "#4b263c" })
      .rect(-5, -18, 10, 12)
      .fill("#707c82")
      .stroke({ width: 3, color: "#263238" });
    this.contentContainer.addChild(this.press);
  }

  private createBaseTexture() {
    if (Workshop.baseTexture) return;
    const graphic = new Graphics();
    makeBasicCircle(graphic, this.baseSize, "#b88ca5", true);
    makeBasicCircle(graphic, this.baseSize - 10, "#e6c7d8", false);
    graphic
      .moveTo(-20, 13)
      .lineTo(20, 13)
      .stroke({ width: 6, color: "#4b263c", cap: "round" });
    Workshop.baseTexture = app.renderer.generateTexture({ target: graphic });
  }

  animation(delta: number) {
    this.phase += delta * 0.08;
    this.press.y = Math.abs(Math.sin(this.phase)) * 9 - 3;
  }
}
