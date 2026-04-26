import { Graphics } from "pixi.js";
import { Building } from "@buildings/building";

export class Laboratory extends Building {
  numberOfSatelites: number = 8;
  sateliteSize: number = 5;
  rotationSpeed: number = 0.05;

  satelites: Graphics[] = [];

  circles: number = 6;

  constructor(x: number, y: number) {
    super(x, y, 9);
    this.draw();
    this.craft = {
      ingridients: [
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
    for (let i = 0; i < this.numberOfSatelites; i++) {
      this.satelites[i] = new Graphics();

      const { x: cx, y: cy } = this.getRadialPoint(
        i,
        this.numberOfSatelites,
        this.baseSize - 5,
      );

      this.satelites[i].position.set(cx, cy);

      for (let j = 0; j < 3; j++) {
        const { x, y } = this.getRadialPoint(j, 3, 10);

        this.satelites[i]
          .moveTo(x, y)
          .circle(x, y, this.sateliteSize)
          .fill("#000000");
      }

      this.visual.addChild(this.satelites[i]);
    }

    this.makeBasicCircle(this.baseSize, "#cc92c3", true);

    this.makeRoundShadow(this.baseSize);

    this.visual.addChild(this.mainGraphic);

    this.drawCircles();
  }

  private drawCircles() {
    this.mainGraphic.circle(0, 0, 8).fill("#b762ac");

    for (let i = 0; i < this.circles; i++) {
      const { x, y } = this.getRadialPoint(
        i * 2 - 1,
        this.circles * 2,
        this.baseSize - 24,
      );

      this.mainGraphic.circle(x, y, 6).fill("#b762ac");
    }

    for (let i = 0; i < this.circles; i++) {
      const { x, y } = this.getRadialPoint(i, this.circles, this.baseSize - 12);

      this.mainGraphic.circle(x, y, 8).fill("#b762ac");
    }
  }

  animation(delta: number) {
    for (let i = 0; i < this.numberOfSatelites; i++) {
      this.satelites[i].rotation += this.rotationSpeed * delta;
    }
  }
}
