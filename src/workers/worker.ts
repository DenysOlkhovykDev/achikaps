import { Graphics, Container } from "pixi.js";
import { Building } from "../buildings/building";
import { getNextBuilding } from "../buildings/_buildings";

import { Resource } from "../resource/resource";

export class Worker {
  root: Container = new Container();
  graphic: Graphics;

  health: number = 100;
  color: string = "#000000";
  currentPlatform: Building;
  targetPlatform?: Building;

  inventory: Resource | undefined;

  constructor(
    public x: number,
    public y: number,
    currentPlatform: Building,
  ) {
    this.graphic = new Graphics();
    this.currentPlatform = currentPlatform;
    this.draw();
    this.initEvents();

    this.root.addChild(this.graphic);
    this.root.position.set(this.x, this.y);
  }

  protected draw() {
    this.graphic.clear();

    this.graphic
      .circle(0, 0, 8)
      .stroke({ width: 2, color: "#000000" })
      .fill(this.color);

    this.graphic.position.set(0, 0);
  }

  protected initEvents() {
    this.root.eventMode = "none";
  }

  moveWorker() {
    if (!this.targetPlatform) {
      this.targetPlatform = getNextBuilding(this.currentPlatform);
    } else {
      const dx = this.targetPlatform.x - this.x;
      const dy = this.targetPlatform.y - this.y;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 3) {
        if (this.targetPlatform.recources.length > 1 && !this.inventory) {
          this.inventory = this.targetPlatform.takeResource();

          if (this.inventory) {
            this.root.addChild(this.inventory.graphic);

            this.inventory.graphic.x = 0;
            this.inventory.graphic.y = 0;
          }
        } else if (
          this.targetPlatform &&
          this.targetPlatform.recources.length < 3 &&
          this.inventory
        ) {
          this.root.removeChild(this.inventory.graphic);

          this.targetPlatform.tryToAddResource(this.inventory);

          this.inventory = undefined;
        }

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

      this.root.position.set(this.x, this.y);
    }
  }
}
