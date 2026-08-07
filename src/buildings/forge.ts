import { Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import { makeBasicCircle, makeRoundShadow } from "@utils/basic-graphic";

export class Forge extends Building {
  private readonly hammer = new Graphics();
  private readonly glow = new Graphics();
  private phase = 0;

  constructor(x: number, y: number) {
    super(x, y, 6, "Forge");
    this.draw();
    this.craft = {
      ingredients: [
        { resourceName: "Meat", count: 2 },
        { resourceName: "Iron", count: 1 },
      ],
      result: "Steel",
    };
    this.priorityForTasks = 5;
    this.generateDeliveryTasks();
    this.generateProductionTask();
  }

  protected draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);
    this.createBaseTexture();
    const base = new Sprite(Forge.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);

    this.glow.circle(0, 10, 11).fill({ color: "#ff8a24", alpha: 0.55 });
    this.hammer
      .moveTo(0, -2)
      .lineTo(0, -24)
      .stroke({ width: 5, color: "#744321", cap: "round" })
      .roundRect(-11, -29, 22, 9, 2)
      .fill("#65737a")
      .stroke({ width: 3, color: "#1f292e" });
    this.contentContainer.addChild(this.glow, this.hammer);
  }

  private createBaseTexture() {
    if (Forge.baseTexture) return;
    const graphic = new Graphics();
    makeBasicCircle(graphic, this.baseSize, "#9b6845", true);
    makeBasicCircle(graphic, this.baseSize - 10, "#4b3a31", false);
    graphic
      .roundRect(-18, 5, 36, 12, 4)
      .fill("#6d787c")
      .stroke({ width: 3, color: "#1e2629" });
    Forge.baseTexture = app.renderer.generateTexture({ target: graphic });
  }

  animation(delta: number) {
    this.phase += delta * 0.09;
    this.hammer.rotation = -0.65 + Math.abs(Math.sin(this.phase)) * 0.75;
    this.glow.alpha = 0.35 + Math.abs(Math.sin(this.phase)) * 0.5;
  }
}
