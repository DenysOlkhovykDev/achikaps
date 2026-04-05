import { Graphics } from "pixi.js";
import { Building } from "@buildings/building";

export class Factory extends Building {
  circles: Graphics[] = [];
  angles: number[] = [];

  count = 5;

  constructor(x: number, y: number) {
    super(x, y, 5);
    this.draw();
  }

  draw() {
    const graphic = new Graphics();

    graphic
      .circle(0, 0, 40)
      .stroke({ width: 3, color: "#000000" })
      .fill("#a8d0db");

    const segments = 4;
    const step = (Math.PI * 2) / segments;
    const gap = 0.35;

    for (let i = 0; i < segments; i++) {
      const startAngle = i * step + gap;
      const endAngle = (i + 1) * step - gap;

      graphic
        .moveTo(0, 0)
        .arc(0, 0, 40, startAngle, endAngle)
        .lineTo(0, 0)
        .fill("#73b8b6");
    }

    graphic.circle(0, 0, 34).fill("#a8d0db");

    this.makeRoundShadow(42);
    this.visual.addChild(graphic);

    for (let i = 0; i < this.count; i++) {
      this.circles[i] = new Graphics();
      this.circles[i]
        .moveTo(0, 0)
        .circle(
          Math.cos((Math.PI * 2 * i) / this.count) * 50,
          Math.sin((Math.PI * 2 * i) / this.count) * 50,
          5,
        )
        .fill("#000000");

      this.visual.addChild(this.circles[i]);
    }
  }

  animation() {
    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].rotation += 0.005;
    }
  }
}
