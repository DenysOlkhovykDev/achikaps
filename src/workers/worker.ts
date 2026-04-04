import { Graphics, Container } from "pixi.js";
import { Building } from "@buildings/building";

import { Resource } from "@resources/resource";
import { dashboard } from "@dashboard/_dashboard";
import { Task, JobType } from "@dashboard/task";

export class Worker {
  root: Container = new Container();
  graphic: Graphics;

  health: number = 100;
  color: string = "#000000";
  targetPlatform?: Building;

  inventory: Resource | undefined;

  path: Building[] = [];
  resourceIndex?: number;
  task: Task | undefined;

  constructor(
    public x: number,
    public y: number,
    public currentPlatform: Building,
  ) {
    this.graphic = new Graphics();
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

  public moveWorker() {
    if (!this.targetPlatform) {
      if (!this.task) {
        this.pickTask();
      }

      if (this.path.length > 0) {
        this.targetPlatform = this.path.shift();
      }

      return;
    }

    const dx = this.targetPlatform.x - this.x;
    const dy = this.targetPlatform.y - this.y;

    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return;

    if (distance < 3) {
      this.onReachPlatform();
      return;
    }

    const vx = dx / distance;
    const vy = dy / distance;

    this.x += vx * 1.5;
    this.y += vy * 1.5;

    this.root.position.set(this.x, this.y);
  }

  private pickTask() {
    this.task = dashboard.getPosibleTaskWithHighestPriority(
      this.currentPlatform,
      JobType.delivery,
    );

    if (!this.task) return;

    const [path, resourceIndex] = this.task.getRouteForResource(
      this.currentPlatform,
    );

    this.path = path;
    this.resourceIndex = resourceIndex;

    if (path.length === 1) {
      this.handleResourceLogic();
    }

    this.path.shift();
  }

  private onReachPlatform() {
    this.currentPlatform = this.targetPlatform!;

    if (this.path.length > 0) {
      this.targetPlatform = this.path.shift();
      return;
    }

    this.handleResourceLogic();

    this.targetPlatform = undefined;
  }

  private handleResourceLogic() {
    if (this.resourceIndex !== undefined) {
      this.inventory = this.currentPlatform.takeResource(this.resourceIndex);
      this.resourceIndex = undefined;

      if (this.inventory) {
        this.root.addChild(this.inventory.graphic);

        this.inventory.graphic.x = 0;
        this.inventory.graphic.y = 0;
      }

      if (this.task) {
        this.path = this.task.getRouteForTarget(this.currentPlatform);
      }

      return;
    }

    if (this.inventory) {
      this.root.removeChild(this.inventory.graphic);
      this.currentPlatform.tryToAddResource(this.inventory);

      this.inventory = undefined;
      this.task = undefined;
    }
  }
}
