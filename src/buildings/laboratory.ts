import { Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import {
  getRadialPoint,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";

export class Laboratory extends Building {
  satelites: Graphics[] = [];
  satelitesParams = {
    amount: 8,
    size: 5,
    rotationSpeed: 0.05,
  };

  amountOfDecorativeCircles: number = 6;

  constructor(x: number, y: number) {
    super(x, y, 4, "Laboratory");
    this.draw();
    this.craft = {
      ingredients: [
        { resourceName: "Iron", count: 1 },
        { resourceName: "Perl", count: 2 },
      ],
      result: "Gum",
    };
    this.priorityForTasks = 5;
    this.generateDeliveryTasks();
    this.generateProductionTask();
  }

  draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);

    this.createSatelites();

    this.createBaseTexture();

    const base = new Sprite(Laboratory.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);
  }

  private createSatelites() {
    for (let i = 0; i < this.satelitesParams.amount; i++) {
      this.satelites[i] = new Graphics();

      const { x: cx, y: cy } = getRadialPoint(
        i,
        this.satelitesParams.amount,
        this.baseSize - 5,
      );

      this.satelites[i].position.set(cx, cy);

      for (let j = 0; j < 3; j++) {
        const { x, y } = getRadialPoint(j, 3, 10);

        this.satelites[i]
          .moveTo(x, y)
          .circle(x, y, this.satelitesParams.size)
          .fill("#000000");
      }

      this.contentContainer.addChild(this.satelites[i]);
    }
  }

  private createBaseTexture() {
    if (Laboratory.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(baseGraphics, this.baseSize, "#cc92c3", true);

    this.makeDecorativeCircles(baseGraphics);

    Laboratory.baseTexture = app.renderer.generateTexture({
      target: baseGraphics,
    });
  }

  private makeDecorativeCircles(baseGraphics: Graphics) {
    baseGraphics.circle(0, 0, 8).fill("#b762ac");

    for (let i = 0; i < this.amountOfDecorativeCircles; i++) {
      const { x, y } = getRadialPoint(
        i * 2 - 1,
        this.amountOfDecorativeCircles * 2,
        this.baseSize - 24,
      );

      baseGraphics.circle(x, y, 6).fill("#b762ac");
    }

    for (let i = 0; i < this.amountOfDecorativeCircles; i++) {
      const { x, y } = getRadialPoint(
        i,
        this.amountOfDecorativeCircles,
        this.baseSize - 12,
      );

      baseGraphics.circle(x, y, 8).fill("#b762ac");
    }
  }

  animation(delta: number) {
    for (let i = 0; i < this.satelitesParams.amount; i++) {
      this.satelites[i].rotation += this.satelitesParams.rotationSpeed * delta;
    }
  }
}
