import { Graphics, Container } from "pixi.js";
import { Building } from "@aircraft/building";

import { Resource } from "@resources/resource";
import {
  deleteTask,
  getPosibleTaskWithHighestPriority,
  releaseTask,
} from "@dashboard/_dashboard";
import { Task, JobType } from "@dashboard/task";
import { delay } from "@utils/delay";

const isTest = import.meta.env.MODE === "test";

type Leg = {
  x: number;
  y: number;
  isMovingForward: boolean;
};

export class Worker {
  root: Container = new Container();
  graphic: Graphics;

  health: number = 100;
  speed: number = 2;
  color: string = "#000000";
  targetPlatform?: Building;

  inventory: Resource | undefined;

  path: Building[] = [];
  reservedResource?: Resource;
  task: Task | undefined;
  isWorking: boolean = false;

  legX = 4;
  legY = 14;
  numberOfLegs = 4;

  legCoordinates: Leg[] = [];
  legs: Graphics[] = [];
  stepPhase = 0;
  isMoving = false;

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

    for (let i = 0; i < this.numberOfLegs; i++) {
      this.legs[i] = new Graphics();
    }
    this.setLegsIdlePose(false);
    this.drawLegs();

    this.graphic
      .circle(0, 0, 8)
      .stroke({ width: 3, color: "#000000" })
      .fill(this.color);

    this.graphic.circle(-5, -4, 2).fill("#ffffff");
    this.graphic.circle(5, -4, 2).fill("#ffffff");

    let jobColor = "#000000";
    if (this.profession === "building") {
      jobColor = "#127ce1";
    } else if (this.profession === "delivering") {
      jobColor = "#bdb434";
    } else if (this.profession === "production") {
      jobColor = "#2ccb1a";
    }

    this.graphic.circle(0, 3, 4).fill(jobColor);

    this.graphic.position.set(0, 0);

    this.root.addChild(...this.legs);
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
    if (this.targetPlatform) {
      if (!this.isMoving) {
        this.isMoving = true;
        this.setLegsIdlePose(true);
      }
    }
    this.legAnimation(delta);

    const targetCenter = this.targetPlatform.getBaseCenterInWorld();

    if (isTest) {
      this.x = targetCenter.x;
      this.y = targetCenter.y;
      this.onReachPlatform();
    } else {
      const dx = targetCenter.x - this.x;
      const dy = targetCenter.y - this.y;

      const angle = Math.atan2(dy, dx);
      this.root.rotation = angle + Math.PI / 2;

      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 3) {
        this.onReachPlatform();
        if (!this.task) {
          this.setLegsIdlePose(false);
        }
        this.isMoving = false;
        this.drawLegs();
        return;
      }

      const vx = dx / distance;
      const vy = dy / distance;

      this.x += vx * this.speed * delta;
      this.y += vy * this.speed * delta;
    }

    this.root.position.set(this.x, this.y);
  }

  private legAnimation(delta: number) {
    this.stepPhase += 0.14 * delta;

    const amplitude = 6;

    const groupA = Math.sin(this.stepPhase);
    const groupB = Math.sin(this.stepPhase + Math.PI);

    this.legCoordinates[0].y = -this.legY + groupA * amplitude + amplitude;
    this.legCoordinates[3].y = this.legY + groupA * amplitude + amplitude;

    this.legCoordinates[1].y = -this.legY + groupB * amplitude + amplitude;
    this.legCoordinates[2].y = this.legY + groupB * amplitude + amplitude;

    this.drawLegs();
  }

  private drawLegs() {
    for (let i = 0; i < this.numberOfLegs; i++) {
      this.legs[i].clear();
      this.legs[i]
        .moveTo(0, 0)
        .lineTo(this.legCoordinates[i].x, this.legCoordinates[i].y)
        .stroke({ width: 4, color: "#000000" })
        .circle(this.legCoordinates[i].x, this.legCoordinates[i].y, 2)
        .stroke({ width: 2, color: "#000000" })
        .fill("#000000");
    }
  }

  private setLegsIdlePose(isMoving: boolean) {
    if (isMoving) {
      this.legCoordinates = [
        { x: -this.legX, y: -this.legY, isMovingForward: true },
        { x: this.legX, y: -this.legY, isMovingForward: false },
        { x: -this.legX, y: this.legY + 4, isMovingForward: true },
        { x: this.legX, y: this.legY + 4, isMovingForward: false },
      ];
    } else {
      this.legCoordinates = [
        { x: -this.legX * 2, y: -this.legY, isMovingForward: true },
        { x: this.legX * 2, y: -this.legY, isMovingForward: false },
        { x: -this.legX * 2, y: this.legY, isMovingForward: true },
        { x: this.legX * 2, y: this.legY, isMovingForward: false },
      ];
    }
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
      if (this.path.length === 0) {
        this.releaseCurrentTask();
        return;
      }

      this.path.shift();

      if (this.path.length === 0) {
        this.handleProductionLogic();
      }
    }
  }

  private pickPathForResource() {
    if (!this.task) return;

    const [path, resource] = this.task.getRouteForResource(
      this.currentPlatform,
      true,
    );

    if (path.length === 0 || !resource) {
      this.releaseCurrentTask();
      return;
    }

    this.path = path;
    this.reservedResource = resource;

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
      const shouldRetry = !this.handleResourceLogic();
      if (shouldRetry) {
        this.targetPlatform = this.currentPlatform;
        return;
      }
    } else {
      this.handleProductionLogic();
    }
    this.targetPlatform = undefined;
  }

  private async handleProductionLogic() {
    if (this.isWorking || !this.task) return;

    const task = this.task;
    this.isWorking = true;
    try {
      while (true) {
        if (!isTest) {
          await delay(1000);
        }

        const result = task.target.tryToDoProduction();

        if (!result) break;
      }
    } finally {
      deleteTask(task);
      task.target.refreshTasks();
      if (this.task === task) {
        this.task = undefined;
      }
      this.isWorking = false;
    }
  }

  private handleResourceLogic() {
    if (this.reservedResource) {
      const resource = this.currentPlatform.takeResource(this.reservedResource);

      if (!resource) {
        this.releaseCurrentTask();
        return true;
      }

      this.task?.releaseResourceReservation();
      this.reservedResource = undefined;
      this.inventory = resource;

      if (this.inventory) {
        this.root.addChild(this.inventory.root);

        this.inventory.root.x = 0;
        this.inventory.root.y = 16;
      }

      if (this.task) {
        this.path = this.task.getRouteForTarget(this.currentPlatform);
      }

      return true;
    }

    if (this.inventory && this.task) {
      const wasAdded = this.currentPlatform.tryToAddResource(
        this.inventory,
        this.task,
      );

      if (!wasAdded) return false;

      this.inventory = undefined;
      this.task = undefined;
      this.path = [];
    }

    return true;
  }

  private releaseCurrentTask() {
    if (this.task) {
      releaseTask(this.task);
    }

    this.task = undefined;
    this.reservedResource = undefined;
    this.path = [];
    this.targetPlatform = undefined;
  }
}
