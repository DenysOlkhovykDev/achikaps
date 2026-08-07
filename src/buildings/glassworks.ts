import { Container, Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import { makeBasicCircle, makeRoundShadow } from "@utils/basic-graphic";

export class Glassworks extends Building {
  private readonly bubbles = new Container();
  private phase = 0;

  constructor(x: number, y: number) {
    super(x, y, 6, "Glassworks");
    this.draw();
    this.craft = {
      ingredients: [{ resourceName: "Perl", count: 3 }],
      result: "GlassBubble",
    };
    this.priorityForTasks = 5;
    this.generateDeliveryTasks();
    this.generateProductionTask();
  }

  protected draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);
    this.createBaseTexture();

    const base = new Sprite(Glassworks.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);

    for (let i = 0; i < 4; i++) {
      const bubble = new Graphics()
        .circle(0, 0, 4 + i)
        .fill({ color: "#d8f7ff", alpha: 0.55 })
        .stroke({ width: 2, color: "#3c8595" });
      const angle = (i / 4) * Math.PI * 2;
      bubble.position.set(Math.cos(angle) * 20, Math.sin(angle) * 20);
      this.bubbles.addChild(bubble);
    }

    this.contentContainer.addChild(this.bubbles);
  }

  private createBaseTexture() {
    if (Glassworks.baseTexture) return;
    const graphic = new Graphics();
    makeBasicCircle(graphic, this.baseSize, "#7fb9c4", true);
    makeBasicCircle(graphic, this.baseSize - 10, "#c8e5e8", false);
    graphic
      .circle(0, 0, 12)
      .fill("#407783")
      .circle(-4, -4, 4)
      .fill({ color: "#ffffff", alpha: 0.7 });
    Glassworks.baseTexture = app.renderer.generateTexture({ target: graphic });
  }

  animation(delta: number) {
    this.phase += delta * 0.045;
    this.bubbles.rotation += delta * 0.012;
    this.bubbles.scale.set(1 + Math.sin(this.phase) * 0.06);
  }
}
