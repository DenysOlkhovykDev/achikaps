import { Graphics } from "pixi.js";
import { Building } from "../buildings/node";
import { getNextBuilding } from "../buildings/_buildings";

export class Worker {
  graphic: Graphics;
  health: number = 100;
  color: string = "#000000";
  currentPlatform: Building;
  targetPlatform?: Building;

  constructor(
    public x: number,
    public y: number,
    currentPlatform: Building,
  ) {
    this.graphic = new Graphics();
    this.currentPlatform = currentPlatform;
    this.draw();
  }

  protected draw() {
    this.graphic.clear();

    this.graphic
      .circle(0, 0, 4)
      .stroke({ width: 2, color: "#000000" })
      .fill(this.color);

    this.graphic.position.set(this.x, this.y);
  }

  moveWorker() {
    if (!this.targetPlatform) {
      this.targetPlatform = getNextBuilding(this.currentPlatform);
    } else {
      const dx = this.targetPlatform.x - this.x;
      const dy = this.targetPlatform.y - this.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 3) {
        const previousPlatform = this.currentPlatform;
        this.currentPlatform = this.targetPlatform!;

        this.targetPlatform = getNextBuilding(
          this.currentPlatform,
          previousPlatform,
        );
      }

      const vx = dx / distance;
      const vy = dy / distance;

      this.x += vx * 1.5;
      this.y += vy * 1.5;

      this.graphic.position.set(this.x, this.y);
    }
  }
}
