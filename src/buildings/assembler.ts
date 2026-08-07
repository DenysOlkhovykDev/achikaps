import { Container, Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import { makeBasicCircle, makeRoundShadow } from "@utils/basic-graphic";

export class Collector extends Building {
  private readonly arms = new Container();

  constructor(x: number, y: number) {
    super(x, y, 6, "Collector");
    this.draw();
    this.craft = {
      ingredients: [
        { resourceName: "Iron", count: 2 },
        { resourceName: "Perl", count: 1 },
      ],
      result: "Joint",
    };
    this.priorityForTasks = 5;
    this.generateDeliveryTasks();
    this.generateProductionTask();
  }

  protected draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);
    this.createBaseTexture();
    const base = new Sprite(Collector.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);

    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const arm = new Graphics()
        .moveTo(8, 0)
        .lineTo(27, 0)
        .stroke({ width: 6, color: "#657985", cap: "round" })
        .circle(28, 0, 5)
        .fill("#8cc7d0")
        .stroke({ width: 2, color: "#26373e" });
      arm.rotation = angle;
      this.arms.addChild(arm);
    }
    this.contentContainer.addChild(this.arms);
  }

  private createBaseTexture() {
    if (Collector.baseTexture) return;
    const graphic = new Graphics();
    makeBasicCircle(graphic, this.baseSize, "#8099a4", true);
    makeBasicCircle(graphic, this.baseSize - 10, "#bfd1d6", false);
    graphic.circle(0, 0, 9).fill("#435861");
    Collector.baseTexture = app.renderer.generateTexture({ target: graphic });
  }

  animation(delta: number) {
    this.arms.rotation += delta * 0.018;
  }
}
