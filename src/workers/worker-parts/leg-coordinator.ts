import { Graphics, Container } from "pixi.js";

interface Leg {
  x: number;
  y: number;
  isMovingForward: boolean;
}

export class LegCoordinator extends Container {
  legX = 4;
  legY = 14;
  numberOfLegs = 4;

  legCoordinates: Leg[] = [];
  legs: Graphics[] = [];
  stepPhase = 0;

  private isMoving = false;

  constructor() {
    super();

    for (let i = 0; i < this.numberOfLegs; i++) {
      this.legs[i] = new Graphics();
    }
    this.setLegsIdlePose();
    this.addChild(...this.legs);
  }

  public draw() {
    for (let i = 0; i < this.numberOfLegs; i++) {
      this.legs[i]
        .clear()
        .moveTo(0, 0)
        .lineTo(this.legCoordinates[i].x, this.legCoordinates[i].y)
        .stroke({ width: 4, color: "#000000" })
        .circle(this.legCoordinates[i].x, this.legCoordinates[i].y, 2)
        .stroke({ width: 2, color: "#000000" })
        .fill("#000000");
    }
  }

  public startMoving() {
    if (this.isMoving) return;

    this.isMoving = true;
    this.setLegsMovingPose();
  }

  public stopMoving() {
    if (!this.isMoving) return;

    this.isMoving = false;
    this.setLegsIdlePose();
  }

  public update(delta: number) {
    if (!this.isMoving) return;

    this.animation(delta);
  }

  public setLegsIdlePose() {
    this.legCoordinates = [
      { x: -this.legX * 2, y: -this.legY, isMovingForward: true },
      { x: this.legX * 2, y: -this.legY, isMovingForward: false },
      { x: -this.legX * 2, y: this.legY, isMovingForward: true },
      { x: this.legX * 2, y: this.legY, isMovingForward: false },
    ];

    this.draw();
  }

  private setLegsMovingPose() {
    this.legCoordinates = [
      { x: -this.legX, y: -this.legY, isMovingForward: true },
      { x: this.legX, y: -this.legY, isMovingForward: false },
      { x: -this.legX, y: this.legY + 4, isMovingForward: true },
      { x: this.legX, y: this.legY + 4, isMovingForward: false },
    ];

    this.draw();
  }

  public animation(delta: number) {
    this.stepPhase += 0.14 * delta;

    const amplitude = 6;

    const groupA = Math.sin(this.stepPhase);
    const groupB = Math.sin(this.stepPhase + Math.PI);

    this.legCoordinates[0].y = -this.legY + groupA * amplitude + amplitude;

    this.legCoordinates[3].y = this.legY + groupA * amplitude + amplitude;

    this.legCoordinates[1].y = -this.legY + groupB * amplitude + amplitude;

    this.legCoordinates[2].y = this.legY + groupB * amplitude + amplitude;

    this.draw();
  }
}
