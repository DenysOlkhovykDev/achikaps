import { Building } from "@buildings/building";

export class House extends Building {
  totalNumberOfAntennas: number = 3;
  numberOfAntennas: number = 3;
  antennasAngleOffset: number = Math.PI / 4;

  movingDirection: boolean = true;
  size: number = 1;
  changeSizeDelay: number = 300;

  constructor(x: number, y: number) {
    super(x, y, 5);
    this.draw();
  }

  draw() {
    this.drawAntennas();

    this.makeBasicCircle(this.baseSize, "#72ac4a", true);

    this.makeBasicCircle(this.baseSize - 18, "#5b8937", false);

    this.makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);
    this.visual.addChild(this.mainGraphic);
  }

  private drawAntennas() {
    for (let i = 0; i < this.numberOfAntennas; i++) {
      const { angle } = this.getRadialPoint(i, this.totalNumberOfAntennas, 1);

      const cos = Math.cos(angle + this.antennasAngleOffset);
      const sin = Math.sin(angle + this.antennasAngleOffset);

      const x1 = cos * (this.baseSize - 5);
      const y1 = sin * (this.baseSize - 5);

      const x2 = cos * (this.baseSize + 18);
      const y2 = sin * (this.baseSize + 18);

      this.mainGraphic
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .stroke({ width: 4, color: "#000000" })
        .circle(x2, y2, 4)
        .fill("#000000");
    }
  }

  animation(delta: number) {
    if (this.changeSizeDelay <= 0) {
      const direction = this.movingDirection ? 1 : -1;
      this.size += 0.01 * delta * direction;
      if (this.size > 1.1) {
        this.movingDirection = false;
      }
      if (this.size <= 1) {
        this.movingDirection = true;
        this.changeSizeDelay = 300;
      }

      this.mainGraphic.scale.set(this.size);
    } else {
      this.changeSizeDelay -= delta;
    }
  }
}
