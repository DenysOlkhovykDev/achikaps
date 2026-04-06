import { Graphics } from "pixi.js";
import { Building } from "@buildings/building";

export class Mine extends Building {
  lines: Graphics = new Graphics();
  crosses: Graphics[] = [];

  count: number = 4;

  isAsc: boolean = true;
  angle: number = 0;

  constructor(x: number, y: number) {
    super(x, y, 5);
    this.draw();
  }

  draw() {
    const graphic = new Graphics();

    graphic
      .circle(0, 0, 40)
      .stroke({ width: 3, color: "#000000" })
      .fill("#d6d1a8");

    this.makeRoundShadow(42);
    this.visual.addChild(graphic);

    const size = 7;

    for (let i = 0; i < this.count; i++) {
      const angle = (Math.PI * 2 * i) / this.count;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const x1 = cos * 40;
      const y1 = sin * 40;

      const x2 = cos * 50;
      const y2 = sin * 50;

      this.lines.moveTo(x1, y1).lineTo(x2, y2);

      const tx1 = -sin * size;
      const ty1 = cos * size;

      const tx2 = sin * size;
      const ty2 = -cos * size;

      this.crosses[i] = new Graphics();

      this.crosses[i].position.set(x2, y2);

      this.crosses[i]
        .lineTo(tx1, ty1)
        .lineTo(tx2, ty2)
        .stroke({ width: 3, color: "#000000" });

      this.visual.addChild(this.crosses[i]);
    }
    this.lines.stroke({ width: 3, color: "#000000" });

    this.visual.addChild(this.lines);
  }

  animation() {
    for (let i = 0; i < this.count; i++) {
      if (this.isAsc) {
        this.crosses[i].rotation += 0.02;
        this.angle += 0.02;
        if (this.angle > 1) {
          this.isAsc = false;
        }
      } else {
        this.crosses[i].rotation -= 0.02;
        this.angle -= 0.02;
        if (this.angle < -1) {
          this.isAsc = true;
        }
      }
    }
  }
}
