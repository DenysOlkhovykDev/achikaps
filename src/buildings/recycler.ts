import { Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import { makeBasicCircle, makeRoundShadow } from "@utils/basic-graphic";

export class Recycler extends Building {
  private readonly recyclingArrows = new Graphics();
  private animationPhase = 0;

  constructor(x: number, y: number) {
    super(x, y, 5, "Recycler");
    this.draw();
    this.craft = {
      ingredients: [{ resourceName: "Truss", count: 1 }],
      result: "Iron",
    };
    this.priorityForTasks = 4;
    this.generateDeliveryTasks();
    this.generateProductionTask();
  }

  protected draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);
    this.createBaseTexture();

    const base = new Sprite(Recycler.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);

    this.drawRecyclingArrows();
    this.contentContainer.addChild(this.recyclingArrows);
  }

  private createBaseTexture() {
    if (Recycler.baseTexture) return;

    const baseGraphics = new Graphics();
    makeBasicCircle(baseGraphics, this.baseSize, "#8fb7a0", true);
    makeBasicCircle(baseGraphics, this.baseSize - 10, "#c1d8c7", false);
    baseGraphics.circle(0, 0, 8).fill("#47725b");

    Recycler.baseTexture = app.renderer.generateTexture({
      target: baseGraphics,
    });
  }

  private drawRecyclingArrows() {
    for (let i = 0; i < 3; i++) {
      const start = i * ((Math.PI * 2) / 3) - Math.PI / 2;
      const end = start + 1.35;
      const endX = Math.cos(end) * 24;
      const endY = Math.sin(end) * 24;

      this.recyclingArrows
        .arc(0, 0, 24, start, end)
        .stroke({ width: 7, color: "#2d8053", cap: "round" })
        .moveTo(endX, endY)
        .lineTo(
          endX + Math.cos(end - 2.35) * 11,
          endY + Math.sin(end - 2.35) * 11,
        )
        .moveTo(endX, endY)
        .lineTo(
          endX + Math.cos(end + 2.35) * 11,
          endY + Math.sin(end + 2.35) * 11,
        )
        .stroke({ width: 6, color: "#2d8053", cap: "round" });
    }
  }

  animation(delta: number) {
    this.animationPhase += delta * 0.045;
    this.recyclingArrows.rotation += delta * 0.008;
    const pulse = 1 + Math.sin(this.animationPhase) * 0.035;
    this.recyclingArrows.scale.set(pulse);
  }
}
