import { Graphics, Container } from "pixi.js";
import { Building } from "@buildings/building";

import { Resource } from "@resources/resource";
import {
  dashboard,
  getPosibleTaskWithHighestPriority,
} from "@dashboard/_dashboard";
import { Task, JobType } from "@dashboard/task";
import { delay } from "@utils/delay";

export class Worker {
  root: Container = new Container();
  graphic: Graphics;

  health: number = 100;
  speed: number = 2;
  color: string = "#000000";
  targetPlatform?: Building;

  inventory: Resource | undefined;

  path: Building[] = [];
  resourceIndex?: number;
  task: Task | undefined;
  isWorking: boolean = false;

  constructor(
    public x: number,
    public y: number,
    public currentPlatform: Building,
    public profession: string,
  ) {
    this.graphic = new Graphics();
    this.draw();
    this.initEvents();

    this.root.addChild(this.graphic);
    this.root.position.set(this.x, this.y);
  }

  protected draw() {
    this.graphic.clear();

    let jobColor = "#000000";
    if (this.profession === "building") {
      jobColor = "#0000ff";
    } else if (this.profession === "delivering") {
      jobColor = "#eeff00";
    } else if (this.profession === "production") {
      jobColor = "#00ff00";
    }

    this.graphic
      .circle(0, 0, 10)
      .stroke({ width: 2, color: jobColor })
      .fill(this.color);

    this.graphic
      .circle(0, 0, 8)
      .stroke({ width: 2, color: "#000000" })
      .fill(this.color);

    this.graphic.position.set(0, 0);
  }

  protected initEvents() {
    this.root.eventMode = "none";
  }

  public moveWorker(delta: number) {
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

    this.x += vx * this.speed * delta;
    this.y += vy * this.speed * delta;

    this.root.position.set(this.x, this.y);
  }

  private pickTask() {
    if (this.profession === "building") {
      this.task = getPosibleTaskWithHighestPriority(
        this.currentPlatform,
        JobType.building,
      );
      this.pickPathForResource();
    } else if (this.profession === "delivering") {
      this.task = getPosibleTaskWithHighestPriority(
        this.currentPlatform,
        JobType.delivering,
      );
      this.pickPathForResource();
    } else if (this.profession === "production") {
      this.task = getPosibleTaskWithHighestPriority(
        this.currentPlatform,
        JobType.production,
      );
      if (!this.task) return;

      this.path = this.task.getRouteForTarget(this.currentPlatform);
      this.path.shift();

      if (this.path.length === 0) {
        if (
          this.task.target.recources.length < this.task.target.inventorySize
        ) {
          this.handleProductionLogic();
        } else {
          this.task = undefined;
          this.targetPlatform = undefined;
          this.path = [];
        }
      }
    }
  }

  private pickPathForResource() {
    if (!this.task) return;

    const [path, resourceIndex] = this.task.getRouteForResource(
      this.currentPlatform,
      true,
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

    if (this.profession === "building" || this.profession === "delivering") {
      this.handleResourceLogic();
    } else {
      this.handleProductionLogic();
    }
    this.targetPlatform = undefined;
  }

  private async handleProductionLogic() {
    if (this.isWorking) return;

    this.isWorking = true;
    while (true) {
      await delay(1000);

      const result = this.task?.target.tryToDoProduction();

      if (!result) break;
    }
    this.isWorking = false;
    this.task = undefined;
  }

  private handleResourceLogic() {
    if (this.resourceIndex !== undefined) {
      this.inventory = this.currentPlatform.takeResourceByIndex(
        this.resourceIndex,
      );
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
      if (this.task) {
        this.currentPlatform.tryToAddResource(this.inventory, this.task);
      }

      this.inventory = undefined;
      this.task = undefined;
    }
  }
}
