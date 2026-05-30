import { Graphics } from "pixi.js";
import { Building } from "@buildings/building";

export class Windmill extends Building {
  numberOfWindmillBlades: number = 20;
  windmillBladesSize: number = 6;
  rotationSpeed: number = 0.005;

  numberOfDecorativeWindmillBlades: number = 3;
  tracesWidth: number = 1.6;
  traceRadiuses = [this.baseSize - 25, this.baseSize - 15, this.baseSize - 5];

  windmillBlades: Graphics = new Graphics();

  constructor(x: number, y: number) {
    super(x, y, 10, "Windmill");
    this.draw();
  }

  draw() {
    this.drawWindmillBlades();

    this.makeBasicCircle(this.baseSize, "#7a8fe3", true);

    this.makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);

    this.drawDecorativeWindmillBlades();

    this.visual.addChild(this.mainGraphic);
  }

  private drawWindmillBlades() {
    for (let i = 0; i < this.numberOfWindmillBlades; i++) {
      const { x: x1, y: y1 } = this.getRadialPoint(
        i,
        this.numberOfWindmillBlades,
        this.baseSize,
      );

      const { x: x2, y: y2 } = this.getRadialPoint(
        i - 1,
        this.numberOfWindmillBlades,
        this.baseSize + this.windmillBladesSize,
      );

      this.windmillBlades
        .moveTo(0, 0)
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .stroke({ width: 3, color: "#000000" });
    }
    this.visual.addChild(this.windmillBlades);
  }

  private drawDecorativeWindmillBlades() {
    this.mainGraphic.circle(0, 0, 5).fill("#9eb2fd");

    for (let i = 0; i < this.numberOfDecorativeWindmillBlades; i++) {
      const { x: x1, y: y1 } = this.getRadialPoint(
        i,
        this.numberOfDecorativeWindmillBlades,
        this.baseSize - 25,
      );

      const { x: x2, y: y2 } = this.getRadialPoint(
        i,
        this.numberOfDecorativeWindmillBlades,
        this.baseSize - 5,
      );

      this.mainGraphic.moveTo(x1, y1).lineTo(x2, y2);

      this.mainGraphic.stroke({ width: 3, color: "#9eb2fd" });

      const { angle } = this.getRadialPoint(
        i,
        this.numberOfDecorativeWindmillBlades,
        1,
      );

      for (let j = 0; j < this.traceRadiuses.length; j++) {
        const startX =
          Math.cos(angle - this.tracesWidth) * this.traceRadiuses[j];
        const startY =
          Math.sin(angle - this.tracesWidth) * this.traceRadiuses[j];

        this.mainGraphic.moveTo(startX, startY);
        this.mainGraphic.arc(
          0,
          0,
          this.traceRadiuses[j],
          angle - this.tracesWidth,
          angle,
        );

        this.mainGraphic.stroke({ width: j + 2, color: "#9eb2fd" });
      }
    }
  }

  animation(delta: number) {
    this.windmillBlades.rotation += this.rotationSpeed * delta;
  }
}
