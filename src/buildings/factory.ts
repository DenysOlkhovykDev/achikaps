import { Graphics, Sprite } from "pixi.js";
import { app } from "../main";
import { Building } from "@buildings/building";
import {
  getRadialPoint,
  makeBasicCircle,
  makeRoundShadow,
} from "@utils/basic-graphic";

export class Factory extends Building {
  satelitesGraphics: Graphics = new Graphics();
  sateliteParams = {
    amount: 5,
    size: 5,
    rotationSpeed: 0.005,
  };

  constructor(x: number, y: number) {
    super(x, y, 5, "Factory");
    this.draw();
    this.craft = {
      ingredients: [],
      result: "Perl",
    };
    this.priorityForTasks = 5;
    this.genProductionTask();
  }

  draw() {
    makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);

    this.createSatelites();

    this.createBaseTexture();

    const base = new Sprite(Factory.baseTexture);
    base.anchor.set(0.5);
    this.contentContainer.addChild(base);
  }

  private createSatelites() {
    for (let i = 0; i < this.sateliteParams.amount; i++) {
      const { x, y } = getRadialPoint(
        i,
        this.sateliteParams.amount,
        this.baseSize + 10,
      );

      this.satelitesGraphics
        .moveTo(0, 0)
        .circle(x, y, this.sateliteParams.size)
        .fill("#000000");
    }
    this.contentContainer.addChild(this.satelitesGraphics);
  }

  private createBaseTexture() {
    if (Factory.baseTexture) return;

    const baseGraphics = new Graphics();

    makeBasicCircle(baseGraphics, this.baseSize, "#a8d0db", true);

    const segments = 4;
    const step = (Math.PI * 2) / segments;
    const gap = 0.35;

    for (let i = 0; i < segments; i++) {
      const startAngle = i * step + gap;
      const endAngle = (i + 1) * step - gap;

      baseGraphics
        .moveTo(0, 0)
        .arc(0, 0, this.baseSize, startAngle, endAngle)
        .fill("#73b8b6");
    }

    makeBasicCircle(baseGraphics, this.baseSize - 8, "#a8d0db", false);

    Factory.baseTexture = app.renderer.generateTexture({
      target: baseGraphics,
    });
  }

  animation(delta: number) {
    this.satelitesGraphics.rotation -=
      this.sateliteParams.rotationSpeed * delta;
  }

  genProductionTask() {
    this.generateProductionTask();
  }
}
