import { Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import { makeBasicCircle, makeRoundShadow } from "@utils/basic-graphic";
import { rotatePoint } from "@utils/basic-geometry";

export class Windmill extends Building {
  private rotor = new Graphics();
  private readonly rotationSpeed = 0.012;

  constructor(x: number, y: number) {
    super(x, y, 5, "Windmill");
    this.draw();

    this.craft = {
      ingredients: [],
      result: "Battery",
    };
    this.priorityForTasks = 5;
    this.generateProductionTask();
  }

  protected draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);

    this.createBaseTexture();

    const base = new Sprite(Windmill.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);

    this.drawRotor();
    this.contentContainer.addChild(this.rotor);
  }

  private createBaseTexture() {
    if (Windmill.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(baseGraphics, this.baseSize, "#88b9ac", true);
    makeBasicCircle(baseGraphics, this.baseSize - 10, "#b9d7cf", false);

    baseGraphics
      .circle(0, 0, 10)
      .fill("#6b8580")
      .stroke({ width: 3, color: "#000000" });

    Windmill.baseTexture = app.renderer.generateTexture({
      target: baseGraphics,
    });
  }

  private drawRotor() {
    const bladeLength = this.baseSize - 6;
    const bladeWidth = 8;

    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI * 2 * i) / 4;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const startTop = rotatePoint(4, -bladeWidth / 2, cos, sin);
      const endTop = rotatePoint(bladeLength, -bladeWidth, cos, sin);
      const endBottom = rotatePoint(
        bladeLength - 4,
        bladeWidth / 2,
        cos,
        sin,
      );
      const startBottom = rotatePoint(4, bladeWidth / 2, cos, sin);

      this.rotor
        .moveTo(startTop.x, startTop.y)
        .lineTo(endTop.x, endTop.y)
        .lineTo(endBottom.x, endBottom.y)
        .lineTo(startBottom.x, startBottom.y)
        .closePath()
        .fill("#f1eee3")
        .stroke({ width: 2, color: "#000000" });
    }

    this.rotor.circle(0, 0, 6).fill("#d4ad4d").stroke({
      width: 2,
      color: "#000000",
    });
  }

  animation(delta: number) {
    this.rotor.rotation += this.rotationSpeed * delta;
  }
}
