import { Building } from "@buildings/building";

export class Smelter extends Building {
  numberOfChemnies: number = 3;
  rotationSpeed: number = 0.005;

  constructor(x: number, y: number) {
    super(x, y, 5);
    this.baseSize = 40;
    this.draw();
  }

  draw() {
    this.makeBasicCircle(this.baseSize, "#dec6a4", true);

    this.makeRoundShadow(this.baseSize);

    this.drawChimneyPart(-1, 15, 20, "#000000");
    this.drawChimneyPart(-1, 14, 16, "#dec6a4");
    this.drawChimneyPart(0, 6, 6, "#da6563");
    this.drawChimneyPart(6, 14, 6, "#000000");

    const segments = 3;
    const step = (Math.PI * 2) / segments;
    const gap = 0.65;

    for (let i = 0; i < segments; i++) {
      const startAngle = i * step + gap;
      const endAngle = (i + 1) * step - gap;

      this.mainGraphic
        .moveTo(0, 0)
        .arc(0, 0, this.baseSize, startAngle, endAngle)
        .fill("#d4b58d");
    }

    this.makeBasicCircle(this.baseSize - 8, "#dec6a4", false);

    this.makeBasicCircle(this.baseSize - 18, "#dbb39e", true);

    this.visual.addChild(this.mainGraphic);
  }

  private drawChimneyPart(
    start: number,
    end: number,
    width: number,
    color: string,
  ) {
    for (let i = 0; i < this.numberOfChemnies; i++) {
      const { x: x1, y: y1 } = this.getRadialPoint(i, 3, this.baseSize + start);

      const { x: x2, y: y2 } = this.getRadialPoint(i, 3, this.baseSize + end);

      this.mainGraphic.moveTo(x1, y1).lineTo(x2, y2);
    }

    this.mainGraphic.stroke({ width: width, color: color });
  }

  animation() {
    this.mainGraphic.rotation += this.rotationSpeed;
  }
}
