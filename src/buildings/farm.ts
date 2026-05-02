import { Graphics, Triangle } from "pixi.js";
import { Building } from "@buildings/building";
import { Meat } from "@resources/meat";

export class Farm extends Building {
  numberOfSpikes: number = 8;
  numberOfAntennas: number = 4;
  antennasAngleOffset: number = Math.PI / 4;

  spikeShape: Triangle = new Triangle(-10, 0, 6, 10, 6, -10);

  antennas: Graphics[] = [];
  movingDirection: boolean = true;
  antennasOffset: number = 0;

  constructor(x: number, y: number) {
    super(x, y, 5);
    this.draw();
    this.priorityForTasks = 5;
    this.generateProductionTask();
  }

  draw() {
    this.drawAntennas();

    this.makeBasicCircle(this.baseSize, "#c08484", true);

    this.drawSpikes();

    this.makeBasicCircle(this.baseSize, "#c08484", false);

    this.makeBasicCircle(this.baseSize - 10, "#c08484", false);

    this.mainGraphic.stroke({ width: 4, color: "#b06667" });

    this.makeRoundShadow(this.baseSize, "#000000", this.shadowContainer);
    this.visual.addChild(this.mainGraphic);
  }

  private drawSpikes() {
    for (let i = 0; i < this.numberOfSpikes; i++) {
      const {
        angle,
        x: cx,
        y: cy,
      } = this.getRadialPoint(i, this.numberOfSpikes, this.baseSize);

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const p1 = this.rotatePoint(
        this.spikeShape.x,
        this.spikeShape.y,
        cos,
        sin,
      );
      const p2 = this.rotatePoint(
        this.spikeShape.x2,
        this.spikeShape.y2,
        cos,
        sin,
      );
      const p3 = this.rotatePoint(
        this.spikeShape.x3,
        this.spikeShape.y3,
        cos,
        sin,
      );

      this.mainGraphic
        .moveTo(cx + p1.x, cy + p1.y)
        .lineTo(cx + p2.x, cy + p2.y)
        .lineTo(cx + p3.x, cy + p3.y)
        .closePath()
        .fill("#c08484");

      this.mainGraphic.stroke({ width: 2, color: "#000000" });
    }
  }

  private rotatePoint(px: number, py: number, cos: number, sin: number) {
    return {
      x: px * cos - py * sin,
      y: px * sin + py * cos,
    };
  }

  private drawAntennas() {
    for (let i = 0; i < this.numberOfAntennas; i++) {
      this.antennas[i] = new Graphics();

      const { angle } = this.getRadialPoint(i, this.numberOfAntennas, 1);

      const cos = Math.cos(angle + this.antennasAngleOffset);
      const sin = Math.sin(angle + this.antennasAngleOffset);

      const x1 = cos * (this.baseSize - 20);
      const y1 = sin * (this.baseSize - 20);

      const x2 = cos * (this.baseSize + 15);
      const y2 = sin * (this.baseSize + 15);

      this.antennas[i]
        .moveTo(x1, y1)
        .lineTo(x2, y2)
        .stroke({ width: 4, color: "#000000" })
        .circle(x2, y2, 4)
        .fill("#000000");

      this.visual.addChild(this.antennas[i]);
    }
  }

  animation(delta: number) {
    const direction = this.movingDirection ? 1 : -1;

    this.antennasOffset += 0.1 * delta * direction;

    if (this.antennasOffset > 2) this.movingDirection = false;
    if (this.antennasOffset < -2) this.movingDirection = true;

    for (let i = 0; i < this.numberOfAntennas; i++) {
      const { angle } = this.getRadialPoint(i, this.numberOfAntennas, 1);

      const cos = Math.cos(angle + this.antennasAngleOffset);
      const sin = Math.sin(angle + this.antennasAngleOffset);

      const x1 = cos * this.antennasOffset;
      const y1 = sin * this.antennasOffset;

      this.antennas[i].position.set(x1, y1);
    }
  }

  override tryToDoProduction() {
    const meat = new Meat();
    return this.tryToAddResource(meat);
  }
}
