import { Graphics, Sprite } from "pixi.js";
import { Building } from "@aircraft/building";
import {
  generateTextureFromOrigin,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";
import { getRadialPoint } from "@utils/basic-geometry";

export class Laboratory extends Building {
  satelitesGraphics: Graphics[] = [];
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
        { resourceName: "Organic", count: 1 },
        { resourceName: "Water", count: 2 },
      ],
      result: "Gum",
    };
    this.priorityForTasks = 5;
    this.generateDeliveryTasks();
    this.generateProductionTask();
  }

  draw() {
    makeRoundShadow(this.baseRadius, "#000000", this.shadowContainer);

    this.createSatelites();

    this.createBaseTexture();

    const base = new Sprite(Laboratory.baseTexture);
    this.contentContainer.addChild(base);
  }

  private createSatelites() {
    for (let i = 0; i < this.satelitesParams.amount; i++) {
      this.satelitesGraphics[i] = new Graphics();

      const { x: cx, y: cy } = getRadialPoint(
        i,
        this.satelitesParams.amount,
        this.baseRadius - 5,
      );

      this.satelitesGraphics[i].position.set(cx, cy);

      for (let j = 0; j < 3; j++) {
        const { x, y } = getRadialPoint(j, 3, 10);

        this.satelitesGraphics[i]
          .moveTo(x, y)
          .circle(x, y, this.satelitesParams.size)
          .fill("#861e38")
          .stroke({ width: 2, color: "#000000" });
      }

      this.contentContainer.addChild(this.satelitesGraphics[i]);
    }
  }

  private createBaseTexture() {
    if (Laboratory.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(baseGraphics, this.baseRadius, "#cc92c3", true);

    this.makeDecorativeCircles(baseGraphics);

    Laboratory.baseTexture = generateTextureFromOrigin(baseGraphics);
  }

  private makeDecorativeCircles(baseGraphics: Graphics) {
    baseGraphics.circle(0, 0, 8).fill("#b762ac");

    for (let i = 0; i < this.amountOfDecorativeCircles; i++) {
      const { x, y } = getRadialPoint(
        i * 2 - 1,
        this.amountOfDecorativeCircles * 2,
        this.baseRadius - 24,
      );

      baseGraphics.circle(x, y, 6).fill("#b762ac");
    }

    for (let i = 0; i < this.amountOfDecorativeCircles; i++) {
      const { x, y } = getRadialPoint(
        i,
        this.amountOfDecorativeCircles,
        this.baseRadius - 12,
      );

      baseGraphics.circle(x, y, 8).fill("#b762ac");
    }
  }

  animation(delta: number) {
    for (let i = 0; i < this.satelitesParams.amount; i++) {
      this.satelitesGraphics[i].rotation +=
        this.satelitesParams.rotationSpeed * delta;
    }
  }
}
