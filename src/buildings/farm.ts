import { Graphics, Triangle } from "pixi.js";
import { Building } from "@buildings/building";

export class Farm extends Building {
  count: number = 8;

  picks: Graphics[] = [];
  isAsc: boolean = true;
  length: number = 0;

  constructor(x: number, y: number) {
    super(x, y, 5);
    this.draw();
  }

  draw() {
    const graphic = new Graphics();

    this.drawPicks();

    this.drawSpikes(graphic, true);

    graphic
      .circle(0, 0, 40)
      .stroke({ width: 3, color: "#000000" })
      .fill("#c08484");

    this.drawSpikes(graphic, false);

    graphic
      .circle(0, 0, 30)
      .fill("#c08484")
      .stroke({ width: 4, color: "#b06667" });

    this.makeRoundShadow(42);
    this.visual.addChild(graphic);
  }

  private drawSpikes(graphic: Graphics, stroke: boolean) {
    for (let i = 0; i < this.count; i++) {
      const angle = (Math.PI * 2 * i) / this.count;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const cos2 = Math.cos(angle + 0.5);
      const sin2 = Math.sin(angle + 0.5);

      const cx = cos * 40;
      const cy = sin * 40;

      const points = new Triangle(0, -10, 10, 8, -10, 8);

      const triangle = new Triangle(
        cx + (points.x * cos2 - points.y * sin2),
        cy + (points.x * sin2 + points.y * cos2),

        cx + (points.x2 * cos2 - points.y2 * sin2),
        cy + (points.x2 * sin2 + points.y2 * cos2),

        cx + (points.x3 * cos2 - points.y3 * sin2),
        cy + (points.x3 * sin2 + points.y3 * cos2),
      );

      graphic
        .moveTo(triangle.x, triangle.y)
        .lineTo(triangle.x2, triangle.y2)
        .lineTo(triangle.x3, triangle.y3)
        .closePath()
        .fill("#c08484");

      if (stroke) {
        graphic.stroke({ width: 4, color: "#000000" });
      }
    }
  }

  private drawPicks() {
    for (let i = 0; i < this.count / 2; i++) {
      this.picks[i] = new Graphics();

      const angle = (Math.PI * 2 * i) / (this.count / 2) + 0.8;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const x1 = cos * 20;
      const y1 = sin * 20;

      const x2 = cos * 55;
      const y2 = sin * 55;

      this.picks[i]
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .stroke({ width: 4, color: "#000000" })
        .circle(x2, y2, 4)
        .fill("#000000");

      this.visual.addChild(this.picks[i]);
    }
  }

  animation() {
    if (this.isAsc) {
      this.length += 0.1;
      if (this.length > 2) {
        this.isAsc = false;
      }
    } else {
      this.length -= 0.1;
      if (this.length < -2) {
        this.isAsc = true;
      }
    }

    for (let i = 0; i < this.count / 2; i++) {
      const angle = (Math.PI * 2 * i) / (this.count / 2) + 0.8;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const x1 = cos * this.length;
      const y1 = sin * this.length;

      this.picks[i].position.set(x1, y1);
    }
  }
}
