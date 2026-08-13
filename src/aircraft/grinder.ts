import { Graphics, Sprite } from "pixi.js";
import { Building } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";
import { getRadialPoint } from "@utils/basic-geometry";

export class Grinder extends Building {
  bladesGraphics: Graphics[] = [];
  bladesParams = {
    amount: 4,
    rotationSpeed: 0.05,
  };

  constructor(x: number, y: number) {
    super(x, y, 4, "Grinder");
    this.draw();
    this.craft = {
      ingredients: [
        { resourceName: "Water", count: 1 },
        { resourceName: "Metal", count: 2 },
      ],
      result: "Truss",
    };
    this.priorityForTasks = 5;
    this.generateDeliveryTasks();
    this.generateProductionTask();
  }

  draw() {
    makeRoundShadow(this.baseRadius, "#000000", this.shadowContainer);

    this.createBlades();

    this.createBaseTexture();

    const base = new Sprite(Grinder.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createBlades() {
    for (let i = 0; i < this.bladesParams.amount; i++) {
      this.bladesGraphics[i] = new Graphics();

      const { x, y } = getRadialPoint(
        i,
        this.bladesParams.amount,
        this.baseRadius + 4,
      );

      this.bladesGraphics[i].position.set(x, y);

      this.bladesGraphics[i]
        .moveTo(0, 0)
        .lineTo(0, -8)
        .lineTo(2, -6)
        .lineTo(4, 0)
        .closePath();
      this.bladesGraphics[i]
        .moveTo(0, 0)
        .lineTo(-8, 0)
        .lineTo(-6, -2)
        .lineTo(0, -4)
        .closePath();
      this.bladesGraphics[i]
        .moveTo(0, 0)
        .lineTo(8, 0)
        .lineTo(6, 2)
        .lineTo(0, 4)
        .closePath();
      this.bladesGraphics[i]
        .moveTo(0, 0)
        .lineTo(0, 8)
        .lineTo(-2, 6)
        .lineTo(-4, 0)
        .closePath();

      this.bladesGraphics[i].stroke({
        width: 1,
        color: "#000000",
        cap: "round",
      });
      this.bladesGraphics[i].fill("#000000");

      this.contentContainer.addChild(this.bladesGraphics[i]);
    }
  }

  private createBaseTexture() {
    if (Grinder.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(baseGraphics, this.baseRadius, "#d2aa8a", true);

    this.makeBladeConnectors(baseGraphics);

    makeBasicCircle(baseGraphics, this.baseRadius - 12, "#846c5b", false);
    makeBasicCircle(baseGraphics, this.baseRadius - 14, "#ce9e81", false);

    Grinder.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private makeBladeConnectors(baseGraphics: Graphics) {
    for (let i = 0; i < this.bladesParams.amount; i++) {
      const { x: x1, y: y1 } = getRadialPoint(
        i,
        this.bladesParams.amount,
        this.baseRadius - 14,
      );

      const { x: x2, y: y2 } = getRadialPoint(
        i,
        this.bladesParams.amount,
        this.baseRadius + 2,
      );

      baseGraphics.moveTo(x1, y1).lineTo(x2, y2);
    }
    baseGraphics.stroke({ width: 8, color: "#bd8e67", cap: "round" });
  }

  animation(delta: number) {
    for (let i = 0; i < this.bladesParams.amount; i++) {
      this.bladesGraphics[i].rotation +=
        this.bladesParams.rotationSpeed * delta;
    }
  }
}
